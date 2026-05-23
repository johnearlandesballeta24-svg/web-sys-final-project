<?php
require_once 'config.php';
$db   = getDB();
$data = $db->query("SELECT * FROM membership_plan ORDER BY plan_amount ASC")->fetchAll();
echo json_encode($data);