<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$body     = json_decode(file_get_contents('php://input'), true);
$email    = trim($body['email']    ?? '');
$password = $body['password']      ?? '';

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit;
}

$db   = getDB();
$stmt = $db->prepare("
  SELECT u.*, m.member_id as member_id
  FROM users u
  LEFT JOIN gym_member m ON u.member_id = m.member_id
  WHERE u.email = ?
  LIMIT 1
");
$stmt->execute([$email]);
$user = $stmt->fetch();

// Use password_verify — timing-safe comparison
if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    exit;
}

if (!$user['is_active']) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Account is deactivated']);
    exit;
}

// Remove sensitive field before sending to client
unset($user['password_hash']);

echo json_encode([
    'success' => true,
    'message' => 'Login successful',
    'user'    => $user,
]);