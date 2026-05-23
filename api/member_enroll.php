<?php
require_once 'config.php';
date_default_timezone_set('Asia/Manila');

$body      = json_decode(file_get_contents('php://input'), true);
$memberId  = $body['member_id']      ?? '';
$planId    = $body['plan_id']        ?? '';
$amount    = $body['amount']         ?? 0;
$method    = $body['payment_method'] ?? 'Cash';

if (!$memberId || !$planId) {
  echo json_encode(['success' => false, 'message' => 'Missing required fields']);
  exit;
}

$db = getDB();

// Set all existing enrollments to Inactive
$stmt = $db->prepare("UPDATE member_enrollment SET status = 'Inactive' WHERE member_id = ?");
$stmt->execute([$memberId]);

// Generate new enrollment ID
$last = $db->query("SELECT enrollment_id FROM member_enrollment ORDER BY enrollment_id DESC LIMIT 1")->fetch();
$num  = $last ? (int) substr($last['enrollment_id'], 2) + 1 : 1;
$enrollId = 'EN' . str_pad($num, 3, '0', STR_PAD_LEFT);

// Insert new enrollment
$stmt = $db->prepare("
  INSERT INTO member_enrollment (enrollment_id, member_id, plan_id, status)
  VALUES (?, ?, ?, 'Active')
");
$stmt->execute([$enrollId, $memberId, $planId]);

// Generate payment ID
$lastPay = $db->query("SELECT payment_id FROM payment ORDER BY payment_id DESC LIMIT 1")->fetch();
$payNum  = $lastPay ? (int) substr($lastPay['payment_id'], 3) + 1 : 1;
$payId   = 'PAY' . str_pad($payNum, 3, '0', STR_PAD_LEFT);

// Record payment
$stmt = $db->prepare("
  INSERT INTO payment (payment_id, member_id, amount, date, payment_method)
  VALUES (?, ?, ?, ?, ?)
");
$stmt->execute([$payId, $memberId, $amount, date('Y-m-d'), $method]);

echo json_encode(['success' => true]);