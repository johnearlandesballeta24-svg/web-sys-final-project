<?php
require_once 'config.php';

$body = json_decode(file_get_contents('php://input'), true);
$id   = $body['equipment_id'] ?? null;

if (!$id) {
  echo json_encode(['success' => false, 'message' => 'No ID provided']);
  exit;
}

$db   = getDB();
$stmt = $db->prepare("DELETE FROM equipment WHERE equipment_id = ?");
$stmt->execute([$id]);

echo json_encode(['success' => true]);