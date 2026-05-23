<?php
require_once 'config.php';
$db   = getDB();
$data = $db->query("
  SELECT me.enrollment_id, me.status,
         CONCAT(m.first_name, ' ', m.last_name) AS member_name,
         mp.plan_name
  FROM member_enrollment me
  JOIN gym_member m  ON me.member_id = m.member_id
  JOIN membership_plan mp ON me.plan_id = mp.plan_id
  ORDER BY me.enrollment_id DESC
")->fetchAll();
echo json_encode($data);