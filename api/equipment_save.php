<?php
require_once 'config.php';

$body   = json_decode(file_get_contents('php://input'), true);
$db     = getDB();
$id     = $body['equipment_id'] ?? null;
$name   = $body['equipment_name'] ?? '';
$cat    = $body['category'] ?? '';
$qty    = $body['quantity'] ?? 0;
$amount = $body['amount'] ?? 0;

if (!$name || !$cat || !$qty || !$amount) {
  echo json_encode(['success' => false, 'message' => 'All fields required']);
  exit;
}

if ($id) {
  // UPDATE existing
  $stmt = $db->prepare("
    UPDATE equipment
    SET equipment_name=?, category=?, quantity=?, amount=?
    WHERE equipment_id=?
  ");
  $stmt->execute([$name, $cat, $qty, $amount, $id]);
} else {
  // INSERT new — generate equipment_id
  $last = $db->query("SELECT equipment_id FROM equipment ORDER BY equipment_id DESC LIMIT 1")->fetch();
  $num  = $last ? (int) substr($last['equipment_id'], 1) + 1 : 1;
  $newId = 'E' . str_pad($num, 3, '0', STR_PAD_LEFT);

  // get staff_id from the logged-in staff — passed from JS
  $staffId = $body['staff_id'] ?? 'S003';

  $stmt = $db->prepare("
    INSERT INTO equipment (equipment_id, staff_id, equipment_name, category, quantity, amount)
    VALUES (?, ?, ?, ?, ?, ?)
  ");
  $stmt->execute([$newId, $staffId, $name, $cat, $qty, $amount]);
}

echo json_encode(['success' => true]);