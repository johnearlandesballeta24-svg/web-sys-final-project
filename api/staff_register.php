<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'Method not allowed']);
  exit;
}

$body     = json_decode(file_get_contents('php://input'), true);
$staff_id = trim($body['staff_id'] ?? '');
$password = $body['password'] ?? '';

if (!$staff_id || !$password) {
  echo json_encode(['success' => false, 'message' => 'Staff ID and password are required']);
  exit;
}

if (strlen($password) < 8) {
  echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters']);
  exit;
}

$db = getDB();

// Check if staff_id exists in gym_staff
$stmt = $db->prepare("SELECT * FROM gym_staff WHERE staff_id = ?");
$stmt->execute([$staff_id]);
$staff = $stmt->fetch();

if (!$staff) {
  echo json_encode(['success' => false, 'message' => 'Staff ID not found']);
  exit;
}

// Check if already registered
$stmt = $db->prepare("SELECT user_id FROM users WHERE staff_id = ?");
$stmt->execute([$staff_id]);
if ($stmt->fetch()) {
  echo json_encode(['success' => false, 'message' => 'This Staff ID already has an account']);
  exit;
}

// Generate user_id
$last = $db->query("SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1")->fetch();
$num    = $last ? (int) substr($last['user_id'], 1) + 1 : 1;
$userId = 'U' . str_pad($num, 3, '0', STR_PAD_LEFT);

$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $db->prepare("
  INSERT INTO users (user_id, first_name, last_name, email, password_hash, role, staff_id)
  VALUES (?, ?, ?, ?, ?, 'staff', ?)
");
$stmt->execute([
  $userId,
  $staff['first_name'],
  $staff['last_name'],
  $staff_id . '@gym.com',  // placeholder email
  $hash,
  $staff_id
]);

echo json_encode(['success' => true, 'message' => 'Staff account created']);