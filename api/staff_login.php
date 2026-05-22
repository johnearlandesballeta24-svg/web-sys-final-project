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

$db   = getDB();
$stmt = $db->prepare("
  SELECT u.*, s.staff_role 
  FROM users u
  JOIN gym_staff s ON u.staff_id = s.staff_id
  WHERE u.staff_id = ?
");
$stmt->execute([$staff_id]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
  echo json_encode(['success' => false, 'message' => 'Invalid Staff ID or password']);
  exit;
}

unset($user['password_hash']);

echo json_encode(['success' => true, 'user' => $user]);