<?php
require_once 'config.php';
$db = getDB();
$id = $_GET['member_id'] ?? '';

$visits      = $db->prepare("SELECT COUNT(*) FROM attendance WHERE member_id = ?");
$visits->execute([$id]);

$plan        = $db->prepare("
  SELECT mp.plan_name FROM member_enrollment me
  JOIN membership_plan mp ON me.plan_id = mp.plan_id
  WHERE me.member_id = ? AND me.status = 'Active' LIMIT 1
");
$plan->execute([$id]);

$paid        = $db->prepare("SELECT SUM(amount) FROM payment WHERE member_id = ?");
$paid->execute([$id]);

$assessments = $db->prepare("SELECT COUNT(*) FROM user_progress WHERE member_id = ?");
$assessments->execute([$id]);

echo json_encode([
  'visits'      => $visits->fetchColumn(),
  'plan'        => $plan->fetchColumn(),
  'total_paid'  => $paid->fetchColumn(),
  'assessments' => $assessments->fetchColumn(),
]);