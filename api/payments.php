<?php
require_once 'config.php';
$db   = getDB();
$data = $db->query("
  SELECT p.*, CONCAT(m.first_name, ' ', m.last_name) AS member_name
  FROM payment p
  JOIN gym_member m ON p.member_id = m.member_id
")->fetchAll();
echo json_encode($data);