<?php
require_once 'config.php';
$db   = getDB();
$data = $db->query("SELECT * FROM gym_member")->fetchAll();
echo json_encode($data);