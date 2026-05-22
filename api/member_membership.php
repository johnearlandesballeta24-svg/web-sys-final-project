<?php
require_once 'config.php';
$db   = getDB();
$id   = $_GET['member_id'] ?? '';
$stmt = $db->prepare("
  SELECT me.status, mp.plan_name, mp.duration, mp.plan_amount
  FROM member_enrollment me
  JOIN membership_plan mp ON me.plan_id = mp.plan_id
  WHERE me.member_id = ? LIMIT 1
");
$stmt->execute([$id]);
$data = $stmt->fetch();
echo json_encode($data ?: []);