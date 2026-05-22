<?php

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Read JSON body sent by React (fetch / axios)
$body = json_decode(file_get_contents('php://input'), true);

$firstName = trim($body['first_name'] ?? '');
$lastName  = trim($body['last_name']  ?? '');
$email     = trim($body['email']      ?? '');
$password  = $body['password']        ?? '';
$role      = $body['role']            ?? 'member';

// ------- Validate -------
$errors = [];
if (!$firstName) $errors[] = 'First name is required';
if (!$lastName)  $errors[] = 'Last name is required';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Invalid email';
if (strlen($password) < 8) $errors[] = 'Password must be at least 8 characters';
if (!in_array($role, ['member', 'staff', 'admin'])) $errors[] = 'Invalid role';

if ($errors) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// ------- Check duplicate email -------
$db   = getDB();
$stmt = $db->prepare("SELECT user_id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'Email is already registered']);
    exit;
}

// ------- Generate user_id (U001, U002 …) -------
// Generate user_id
$last = $db->query("SELECT user_id FROM users ORDER BY user_id DESC LIMIT 1")->fetch();
$num    = $last ? (int) substr($last['user_id'], 1) + 1 : 1;
$userId = 'U' . str_pad($num, 3, '0', STR_PAD_LEFT);

$hash = password_hash($password, PASSWORD_BCRYPT);

// If member, also insert into gym_member
$memberId = null;
if ($role === 'member') {
  $lastMember = $db->query("SELECT member_id FROM gym_member ORDER BY member_id DESC LIMIT 1")->fetch();
  $mNum     = $lastMember ? (int) substr($lastMember['member_id'], 1) + 1 : 1;
  $memberId = 'M' . str_pad($mNum, 3, '0', STR_PAD_LEFT);

  $stmt = $db->prepare("
    INSERT INTO gym_member (member_id, first_name, last_name, gender, phone_number, email, birthday, street, city)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  ");
  $stmt->execute([
    $memberId,
    $firstName,
    $lastName,
    $body['gender']   ?? 'Male',
    $body['phone']    ?? '',
    $email,
    $body['birthday'] ?? '2000-01-01',
    $body['street']   ?? '',
    $body['city']     ?? '',
  ]);
}

// ------- Hash password (NEVER store plain text) -------
$hash = password_hash($password, PASSWORD_BCRYPT);

// ------- Insert -------
// Insert into users
$stmt = $db->prepare("
  INSERT INTO users (user_id, first_name, last_name, email, password_hash, role, member_id)
  VALUES (?, ?, ?, ?, ?, ?, ?)
");
$stmt->execute([$userId, $firstName, $lastName, $email, $hash, $role, $memberId]);
$stmt->execute([$userId, $firstName, $lastName, $email, $hash, $role]);

http_response_code(201);
echo json_encode([
    'success' => true,
    'message' => 'Account created successfully',
    'user_id' => $userId,
]);