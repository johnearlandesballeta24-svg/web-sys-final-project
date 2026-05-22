<?php
require_once 'config.php';
$db   = getDB();
$id   = $_GET['member_id'] ?? '';
$stmt = $db->prepare("SELECT * FROM gym_member WHERE member_id = ?");
$stmt->execute([$id]);
echo json_encode($stmt->fetch());