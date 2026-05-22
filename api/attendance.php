<?php
require_once 'config.php';
$db   = getDB();
$data = $db->query("
  SELECT a.*, CONCAT(m.first_name, ' ', m.last_name) AS member_name
  FROM attendance a
  JOIN gym_member m ON a.member_id = m.member_id
")->fetchAll();
echo json_encode($data);