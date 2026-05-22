<?php
require_once 'config.php';
$db   = getDB();
$data = $db->query("
  SELECT fp.*, s.session, s.duration_mins,
         CONCAT(st.first_name, ' ', st.last_name) AS trainer
  FROM fitness_program fp
  JOIN schedule s ON fp.sched_id = s.sched_id
  JOIN gym_staff st ON s.staff_id = st.staff_id
")->fetchAll();
echo json_encode($data);