<?php
require_once 'config.php';
date_default_timezone_set('Asia/Manila');

$body      = json_decode(file_get_contents('php://input'), true);
$scannedId = trim($body['scanned_id'] ?? '');

if (!$scannedId) {
  echo json_encode(['success' => false, 'message' => 'No ID scanned']);
  exit;
}

$db    = getDB();
$today = date('Y-m-d');
$now   = date('H:i:s');

// Check if member or staff
$name = null;

if (str_starts_with($scannedId, 'M')) {
  $stmt = $db->prepare("SELECT CONCAT(first_name, ' ', last_name) as name FROM gym_member WHERE member_id = ?");
  $stmt->execute([$scannedId]);
  $row  = $stmt->fetch();
  $name = $row['name'] ?? null;
} elseif (str_starts_with($scannedId, 'S')) {
  $stmt = $db->prepare("SELECT CONCAT(first_name, ' ', last_name) as name FROM gym_staff WHERE staff_id = ?");
  $stmt->execute([$scannedId]);
  $row  = $stmt->fetch();
  $name = $row['name'] ?? null;
}

if (!$name) {
  echo json_encode(['success' => false, 'message' => 'ID not found in system']);
  exit;
}

// Check today's latest record
$stmt = $db->prepare("
  SELECT * FROM attendance
  WHERE member_id = ? AND date = ?
  ORDER BY attendance_id DESC LIMIT 1
");
$stmt->execute([$scannedId, $today]);
$existing = $stmt->fetch();

if (!$existing) {
  // No record today — time in
  $lastA = $db->query("SELECT attendance_id FROM attendance ORDER BY attendance_id DESC LIMIT 1")->fetch();
  $num   = $lastA ? (int) substr($lastA['attendance_id'], 1) + 1 : 1;
  $newId = 'A' . str_pad($num, 3, '0', STR_PAD_LEFT);

  $stmt = $db->prepare("
    INSERT INTO attendance (attendance_id, member_id, date, time_in, time_out)
    VALUES (?, ?, ?, ?, '00:00:00')
  ");
  $stmt->execute([$newId, $scannedId, $today, $now]);

  echo json_encode([
    'success' => true,
    'name'    => $name,
    'action'  => '✓ Time In recorded',
    'time'    => $now,
  ]);

} elseif ($existing['time_out'] === '00:00:00') {
  // Has time_in but no time_out — record time out
  $stmt = $db->prepare("
    UPDATE attendance SET time_out = ? WHERE attendance_id = ?
  ");
  $stmt->execute([$now, $existing['attendance_id']]);

  echo json_encode([
    'success' => true,
    'name'    => $name,
    'action'  => '✓ Time Out recorded',
    'time'    => $now,
  ]);

} else {
  // Both time_in and time_out exist — create NEW time in record
  $lastA = $db->query("SELECT attendance_id FROM attendance ORDER BY attendance_id DESC LIMIT 1")->fetch();
  $num   = $lastA ? (int) substr($lastA['attendance_id'], 1) + 1 : 1;
  $newId = 'A' . str_pad($num, 3, '0', STR_PAD_LEFT);

  $stmt = $db->prepare("
    INSERT INTO attendance (attendance_id, member_id, date, time_in, time_out)
    VALUES (?, ?, ?, ?, '00:00:00')
  ");
  $stmt->execute([$newId, $scannedId, $today, $now]);

  echo json_encode([
    'success' => true,
    'name'    => $name,
    'action'  => '✓ Time In recorded',
    'time'    => $now,
  ]);
}