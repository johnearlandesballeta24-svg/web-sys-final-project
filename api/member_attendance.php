<?php
require_once 'config.php';
$db   = getDB();
$id   = $_GET['member_id'] ?? '';
$stmt = $db->prepare("SELECT * FROM attendance WHERE member_id = ? ORDER BY date DESC");
$stmt->execute([$id]);
echo json_encode($stmt->fetchAll());