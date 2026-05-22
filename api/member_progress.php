    <?php
require_once 'config.php';
$db   = getDB();
$id   = $_GET['member_id'] ?? '';
$stmt = $db->prepare("SELECT * FROM user_progress WHERE member_id = ? ORDER BY assessment_date DESC");
$stmt->execute([$id]);
echo json_encode($stmt->fetchAll());