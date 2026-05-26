-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 23, 2026 at 09:55 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gym_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `attendance_id` varchar(10) NOT NULL,
  `member_id` varchar(10) NOT NULL,
  `date` date NOT NULL,
  `time_in` time NOT NULL,
  `time_out` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`attendance_id`, `member_id`, `date`, `time_in`, `time_out`) VALUES
('A001', 'M001', '2025-01-06', '06:00:00', '07:30:00'),
('A002', 'M002', '2025-01-06', '17:00:00', '18:30:00'),
('A003', 'M003', '2025-01-07', '07:00:00', '08:00:00'),
('A004', 'M004', '2025-01-08', '08:00:00', '09:30:00'),
('A005', 'M007', '2026-05-22', '10:52:55', '17:37:11'),
('A006', 'M007', '2026-05-22', '17:49:05', '17:49:18'),
('A007', 'M007', '2026-05-22', '17:49:24', '17:52:59'),
('A008', 'M007', '2026-05-22', '17:53:02', '17:54:55'),
('A009', 'M007', '2026-05-22', '17:55:44', '22:44:59'),
('A010', 'M007', '2026-05-23', '15:02:40', '15:10:53');

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `equipment_id` varchar(10) NOT NULL,
  `staff_id` varchar(10) NOT NULL,
  `equipment_name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`equipment_id`, `staff_id`, `equipment_name`, `category`, `quantity`, `amount`) VALUES
('E001', 'S003', 'Treadmill', 'Cardio', 5, 25000),
('E002', 'S003', 'Barbell Set', 'Free Weights', 10, 8000),
('E003', 'S003', 'Bench Press', 'Strength', 4, 15000),
('E004', 'S003', 'Rowing Machine', 'Cardio', 5, 50000),
('E005', 'S003', 'Yoga Mats', 'Flexibility', 100, 2000);

-- --------------------------------------------------------

--
-- Table structure for table `fitness_program`
--

CREATE TABLE `fitness_program` (
  `program_id` varchar(10) NOT NULL,
  `sched_id` varchar(10) NOT NULL,
  `fitness_program` varchar(100) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fitness_program`
--

INSERT INTO `fitness_program` (`program_id`, `sched_id`, `fitness_program`, `date`) VALUES
('FP001', 'SC001', 'Zumba', '2025-01-06'),
('FP002', 'SC002', 'Yoga', '2025-01-07'),
('FP003', 'SC003', 'Weightlifting', '2025-01-08'),
('FP004', 'SC004', 'Cycling', '2025-01-11');

-- --------------------------------------------------------

--
-- Table structure for table `gym_member`
--

CREATE TABLE `gym_member` (
  `member_id` varchar(10) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `birthday` date NOT NULL,
  `street` varchar(100) NOT NULL,
  `city` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gym_member`
--

INSERT INTO `gym_member` (`member_id`, `first_name`, `last_name`, `gender`, `phone_number`, `email`, `birthday`, `street`, `city`) VALUES
('M001', 'Juan', 'dela Cruz', 'Male', '09171234567', 'juan@email.com', '2000-03-15', 'Blk 4 Lot 2', 'Quezon City'),
('M002', 'Maria', 'Santos', 'Female', '09281234567', 'maria@email.com', '1994-07-22', '123 Rizal St.', 'Makati'),
('M003', 'Carlo', 'Reyes', 'Male', '09191234567', 'carlo@email.com', '2005-01-10', '456 Mabini Ave.', 'Pasig'),
('M004', 'Ana', 'Garcia', 'Female', '09561234567', 'ana@email.com', '1997-11-05', '789 Luna St.', 'Taguig'),
('M005', 'Gain', 'Balino', 'Male', '09123569854', 'gian@louis.com', '1998-04-14', 'Blk 9 Lot3', 'Sto Domingo City'),
('M006', 'Gain', 'Balino', 'Male', '09123569854', 'louis@louis.com', '1998-04-14', 'Blk 9 Lot3', 'Sto Domingo City'),
('M007', 'Earl', 'Ballet', 'Male', '09123456789', 'ballet@aru.com', '1944-02-12', 'Lot10', 'STDG');

-- --------------------------------------------------------

--
-- Table structure for table `gym_staff`
--

CREATE TABLE `gym_staff` (
  `staff_id` varchar(10) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `birthday` date NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `staff_role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gym_staff`
--

INSERT INTO `gym_staff` (`staff_id`, `first_name`, `last_name`, `gender`, `birthday`, `phone_number`, `staff_role`) VALUES
('S001', 'Ramon', 'Villanueva', 'Male', '1985-03-14', '09171112222', 'Trainer'),
('S002', 'Liza', 'Mendoza', 'Female', '1997-02-15', '09282223333', 'Trainer'),
('S003', 'Ben', 'Aquino', 'Male', '2001-05-16', '09193334444', 'Maintenance'),
('S004', 'Rosa', 'Flores', 'Female', '2003-06-17', '09564445555', 'Receptionist');

-- --------------------------------------------------------

--
-- Table structure for table `membership_plan`
--

CREATE TABLE `membership_plan` (
  `plan_id` varchar(10) NOT NULL,
  `plan_name` varchar(50) NOT NULL,
  `duration` varchar(20) NOT NULL,
  `plan_amount` int(11) NOT NULL,
  `joining_fee` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `membership_plan`
--

INSERT INTO `membership_plan` (`plan_id`, `plan_name`, `duration`, `plan_amount`, `joining_fee`) VALUES
('P001', 'Basic', '1 month', 500, 200),
('P002', 'Standard', '3 months', 1400, 250),
('P003', 'Premium', '6 months', 2400, 0),
('P004', 'Annual', '12 months', 4000, 0);

-- --------------------------------------------------------

--
-- Table structure for table `member_enrollment`
--

CREATE TABLE `member_enrollment` (
  `enrollment_id` varchar(10) NOT NULL,
  `member_id` varchar(10) NOT NULL,
  `plan_id` varchar(10) NOT NULL,
  `status` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `member_enrollment`
--

INSERT INTO `member_enrollment` (`enrollment_id`, `member_id`, `plan_id`, `status`) VALUES
('EN001', 'M001', 'P001', 'Active'),
('EN002', 'M002', 'P003', 'Active'),
('EN003', 'M003', 'P002', 'Inactive'),
('EN004', 'M004', 'P004', 'Active'),
('EN005', 'M007', 'P002', 'Inactive'),
('EN006', 'M007', 'P001', 'Inactive'),
('EN007', 'M007', 'P001', 'Inactive'),
('EN008', 'M007', 'P002', 'Inactive'),
('EN009', 'M007', 'P002', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `payment_id` varchar(10) NOT NULL,
  `member_id` varchar(10) NOT NULL,
  `amount` int(11) NOT NULL,
  `date` date NOT NULL,
  `payment_method` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`payment_id`, `member_id`, `amount`, `date`, `payment_method`) VALUES
('PAY001', 'M001', 700, '2025-01-01', 'Cash'),
('PAY002', 'M002', 2400, '2025-01-02', 'GCash'),
('PAY003', 'M003', 1500, '2025-01-03', 'Credit Card'),
('PAY004', 'M004', 4500, '2025-01-04', 'Bank Transfer'),
('PAY005', 'M007', 1650, '2026-05-23', 'Cash'),
('PAY006', 'M007', 700, '2026-05-23', 'Cash'),
('PAY007', 'M007', 700, '2026-05-23', 'Cash'),
('PAY008', 'M007', 1650, '2026-05-23', 'Cash'),
('PAY009', 'M007', 1650, '2026-05-23', 'Cash');

-- --------------------------------------------------------

--
-- Table structure for table `schedule`
--

CREATE TABLE `schedule` (
  `sched_id` varchar(10) NOT NULL,
  `staff_id` varchar(10) NOT NULL,
  `session` varchar(20) NOT NULL,
  `duration_mins` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedule`
--

INSERT INTO `schedule` (`sched_id`, `staff_id`, `session`, `duration_mins`) VALUES
('SC001', 'S001', 'Morning', 60),
('SC002', 'S002', 'Evening', 45),
('SC003', 'S001', 'Afternoon', 90),
('SC004', 'S002', 'Morning', 60);

-- --------------------------------------------------------

--
-- Table structure for table `schedule_day`
--

CREATE TABLE `schedule_day` (
  `sched_id` varchar(10) NOT NULL,
  `day` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schedule_day`
--

INSERT INTO `schedule_day` (`sched_id`, `day`) VALUES
('SC001', 'Fri'),
('SC001', 'Mon'),
('SC001', 'Wed'),
('SC002', 'Thu'),
('SC002', 'Tue'),
('SC003', 'Fri'),
('SC003', 'Mon'),
('SC003', 'Thu'),
('SC003', 'Tue'),
('SC003', 'Wed'),
('SC004', 'Sat'),
('SC004', 'Sun');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` varchar(10) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('member','staff','admin') NOT NULL DEFAULT 'member',
  `member_id` varchar(10) DEFAULT NULL,
  `staff_id` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `password_hash`, `role`, `member_id`, `staff_id`, `created_at`, `is_active`) VALUES
('U001', 'Admin', 'User', 'admin@gym.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NULL, NULL, '2026-05-22 02:38:59', 1),
('U003', 'Ramon', 'Villanueva', 'S001@gym.com', '$2y$10$dwTMvgNyF1Yvdlgl6Eb8XeCJx3NwFWYbxWLHiEEn/XJ6y3ELK2O6W', 'staff', NULL, 'S001', '2026-05-22 03:28:30', 1),
('U004', 'Ben', 'Aquino', 'S003@gym.com', '$2y$10$v0otOXHYMQQSOix9MWDHoulMXjR3Vr8IzYtFurMZwq4EbPPVi3ObG', 'staff', NULL, 'S003', '2026-05-22 03:52:41', 1),
('U005', 'Gain', 'Balino', 'gian@louis.com', '$2y$10$MinznXTW.V.NDcI5s7NFYO/rqLUhaAa7KsJk7RW5w/pvBekqdDCsG', 'member', 'M005', NULL, '2026-05-22 06:36:29', 1),
('U006', 'Earl', 'Ballet', 'ballet@aru.com', '$2y$10$2Zu.E9Cc7um3xEKAnw5GMOIjfzvlpvo36wKTGYy07VrUQVZ4DbmEu', 'member', 'M007', NULL, '2026-05-22 08:29:48', 1),
('U007', 'Rosa', 'Flores', 'S004@gym.com', '$2y$10$/Ognk0M9ksCndA9f/d2yPOJO1bQVEPlZOtQDzoIQ2qyMOfC5xxJNe', 'staff', NULL, 'S004', '2026-05-23 07:16:29', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_progress`
--

CREATE TABLE `user_progress` (
  `progress_id` varchar(10) NOT NULL,
  `member_id` varchar(10) NOT NULL,
  `assessment_date` date NOT NULL,
  `height` int(11) NOT NULL,
  `weight` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_progress`
--

INSERT INTO `user_progress` (`progress_id`, `member_id`, `assessment_date`, `height`, `weight`) VALUES
('UP001', 'M001', '2025-01-06', 170, 68),
('UP002', 'M002', '2025-01-06', 155, 52),
('UP003', 'M003', '2025-01-07', 175, 80),
('UP004', 'M004', '2025-01-08', 160, 58);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`attendance_id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`equipment_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `fitness_program`
--
ALTER TABLE `fitness_program`
  ADD PRIMARY KEY (`program_id`),
  ADD KEY `sched_id` (`sched_id`);

--
-- Indexes for table `gym_member`
--
ALTER TABLE `gym_member`
  ADD PRIMARY KEY (`member_id`);

--
-- Indexes for table `gym_staff`
--
ALTER TABLE `gym_staff`
  ADD PRIMARY KEY (`staff_id`);

--
-- Indexes for table `membership_plan`
--
ALTER TABLE `membership_plan`
  ADD PRIMARY KEY (`plan_id`);

--
-- Indexes for table `member_enrollment`
--
ALTER TABLE `member_enrollment`
  ADD PRIMARY KEY (`enrollment_id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `plan_id` (`plan_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indexes for table `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`sched_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `schedule_day`
--
ALTER TABLE `schedule_day`
  ADD PRIMARY KEY (`sched_id`,`day`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD PRIMARY KEY (`progress_id`),
  ADD KEY `member_id` (`member_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `gym_member` (`member_id`);

--
-- Constraints for table `equipment`
--
ALTER TABLE `equipment`
  ADD CONSTRAINT `equipment_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `gym_staff` (`staff_id`);

--
-- Constraints for table `fitness_program`
--
ALTER TABLE `fitness_program`
  ADD CONSTRAINT `fitness_program_ibfk_1` FOREIGN KEY (`sched_id`) REFERENCES `schedule` (`sched_id`);

--
-- Constraints for table `member_enrollment`
--
ALTER TABLE `member_enrollment`
  ADD CONSTRAINT `member_enrollment_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `gym_member` (`member_id`),
  ADD CONSTRAINT `member_enrollment_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `membership_plan` (`plan_id`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `gym_member` (`member_id`);

--
-- Constraints for table `schedule`
--
ALTER TABLE `schedule`
  ADD CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `gym_staff` (`staff_id`);

--
-- Constraints for table `schedule_day`
--
ALTER TABLE `schedule_day`
  ADD CONSTRAINT `schedule_day_ibfk_1` FOREIGN KEY (`sched_id`) REFERENCES `schedule` (`sched_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_member` FOREIGN KEY (`member_id`) REFERENCES `gym_member` (`member_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_ibfk_staff` FOREIGN KEY (`staff_id`) REFERENCES `gym_staff` (`staff_id`) ON DELETE SET NULL;

--
-- Constraints for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD CONSTRAINT `user_progress_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `gym_member` (`member_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
