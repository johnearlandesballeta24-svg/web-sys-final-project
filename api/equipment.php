<?php
require_once 'config.php';
$db   = getDB();
$data = $db->query("SELECT * FROM equipment")->fetchAll();
echo json_encode($data);