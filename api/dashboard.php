<?php
require_once 'config.php';
$db = getDB();

$members    = $db->query("SELECT COUNT(*) FROM gym_member")->fetchColumn();
$attendance = $db->query("SELECT COUNT(*) FROM attendance")->fetchColumn();
$payments   = $db->query("SELECT SUM(amount) FROM payment")->fetchColumn();
$equipment  = $db->query("SELECT COUNT(*) FROM equipment")->fetchColumn();

echo json_encode([
  'members'    => $members,
  'attendance' => $attendance,
  'payments'   => $payments,
  'equipment'  => $equipment,
]);