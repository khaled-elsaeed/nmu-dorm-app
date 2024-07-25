-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 25, 2024 at 07:35 PM
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
-- Database: `nmudorm`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `middleName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `hashedPassword` varchar(255) NOT NULL,
  `lastLogin` datetime NOT NULL DEFAULT current_timestamp(),
  `role` enum('admin','member') NOT NULL,
  `profilePicturePath` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`id`, `firstName`, `middleName`, `lastName`, `username`, `email`, `hashedPassword`, `lastLogin`, `role`, `profilePicturePath`) VALUES
(12, 'Khaled', 'El-Saeed Hamed', 'Zahran', 'Khaled Zahran', 'kjdalkjf223233232@nmu.edu.eg', '$2y$10$y77A0SGB4pTvKq1PtJf40O8M6eW76pvIZ1j20oTEAYoI0kV4xdtDC', '2024-07-22 23:53:57', 'member', 'Zahran_223322325.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `addressinfo`
--

CREATE TABLE `addressinfo` (
  `id` int(11) NOT NULL,
  `memberId` int(11) NOT NULL,
  `governorate` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `street` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addressinfo`
--

INSERT INTO `addressinfo` (`id`, `memberId`, `governorate`, `city`, `street`) VALUES
(8, 12, 'Cairo', 'Al Azbakeyah', 'Maadi , cairo');

-- --------------------------------------------------------

--
-- Table structure for table `administrator`
--

CREATE TABLE `administrator` (
  `id` int(11) NOT NULL,
  `accountId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `alert`
--

CREATE TABLE `alert` (
  `id` int(11) NOT NULL,
  `universityId` int(11) DEFAULT NULL,
  `type` enum('alert','warning','expulsion') NOT NULL,
  `date` date NOT NULL,
  `descriptionId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alert`
--

INSERT INTO `alert` (`id`, `universityId`, `type`, `date`, `descriptionId`) VALUES
(3, 221101039, 'warning', '2024-07-25', 1),
(4, 221101039, 'expulsion', '2024-07-25', 2);

-- --------------------------------------------------------

--
-- Table structure for table `apartments`
--

CREATE TABLE `apartments` (
  `id` int(11) NOT NULL,
  `buildingId` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  `maxRoomCapacity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `apartments`
--

INSERT INTO `apartments` (`id`, `buildingId`, `number`, `maxRoomCapacity`) VALUES
(1, 2, 10, 5);

-- --------------------------------------------------------

--
-- Table structure for table `buildings`
--

CREATE TABLE `buildings` (
  `id` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  `category` varchar(50) NOT NULL,
  `maxApartmentCapacity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `buildings`
--

INSERT INTO `buildings` (`id`, `number`, `category`, `maxApartmentCapacity`) VALUES
(2, 48, 'male', 78);

-- --------------------------------------------------------

--
-- Table structure for table `criteria`
--

CREATE TABLE `criteria` (
  `id` int(11) NOT NULL,
  `fieldId` int(11) NOT NULL,
  `criteria` varchar(100) NOT NULL,
  `criteriaType` varchar(50) NOT NULL,
  `weight` decimal(5,2) NOT NULL,
  `timeAdded` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `criteria`
--

INSERT INTO `criteria` (`id`, `fieldId`, `criteria`, `criteriaType`, `weight`, `timeAdded`) VALUES
(5, 9, 'x < 2', 'numerical', 0.00, '2024-07-23 16:23:02'),
(6, 9, 'x >= 2 and x < 3', 'numerical', 1.00, '2024-07-23 16:23:02'),
(7, 9, 'x >= 3 and x < 4', 'numerical', 2.00, '2024-07-23 16:23:02'),
(9, 10, 'x = Female', 'categorical', 2.00, '2024-07-23 16:23:02'),
(12, 11, 'x = Level 2', 'categorical', 1.00, '2024-07-23 16:23:02'),
(13, 11, 'x = Level 3', 'categorical', 1.00, '2024-07-23 16:23:02'),
(14, 12, 'x = Yes', 'categorical', 1.00, '2024-07-23 16:23:02'),
(15, 12, 'x = No', 'categorical', 0.00, '2024-07-23 16:23:02'),
(16, 13, 'x = Yes', 'categorical', 1.00, '2024-07-23 16:23:02'),
(17, 13, 'x = No', 'categorical', 0.00, '2024-07-23 16:23:02'),
(18, 14, 'x = Yes', 'categorical', 1.00, '2024-07-23 16:23:02'),
(19, 14, 'x = No', 'categorical', 0.00, '2024-07-23 16:23:02'),
(20, 15, 'x >= 55 and x < 65', 'numerical', 1.00, '2024-07-23 16:23:02'),
(21, 15, 'x >= 65 and x < 75', 'numerical', 2.00, '2024-07-23 16:23:02'),
(22, 15, 'x >= 75 and x < 85', 'numerical', 3.00, '2024-07-23 16:23:02'),
(23, 15, 'x >= 85', 'numerical', 4.00, '2024-07-23 16:23:02'),
(25, 16, 'x = Assiut', 'categorical', 5.00, '2024-07-23 16:23:02'),
(26, 16, 'x = Alexandria', 'categorical', 3.00, '2024-07-23 16:23:02'),
(27, 16, 'x = Ismailia', 'categorical', 3.00, '2024-07-23 16:23:02'),
(28, 16, 'x = Luxor', 'categorical', 5.00, '2024-07-23 16:23:02'),
(29, 16, 'x = Red Sea', 'categorical', 5.00, '2024-07-23 16:23:02'),
(30, 16, 'x = Beheira', 'categorical', 2.00, '2024-07-23 16:23:02'),
(31, 16, 'x = Giza', 'categorical', 3.00, '2024-07-23 16:23:02'),
(32, 16, 'x = Dakahlia', 'categorical', 1.00, '2024-07-23 16:23:02'),
(33, 16, 'x = Matrouh', 'categorical', 5.00, '2024-07-23 16:23:02'),
(34, 16, 'x = Kafr El Sheikh', 'categorical', 1.00, '2024-07-23 16:23:02'),
(35, 16, 'x = Qena', 'categorical', 5.00, '2024-07-23 16:23:02'),
(36, 16, 'x = North Sinai', 'categorical', 5.00, '2024-07-23 16:23:02'),
(37, 16, 'x = Sohag', 'categorical', 5.00, '2024-07-23 16:23:02'),
(38, 16, 'x = Damietta', 'categorical', 1.00, '2024-07-23 16:23:02'),
(39, 16, 'x = Port Said', 'categorical', 2.00, '2024-07-23 16:23:02'),
(40, 16, 'x = Beni Suef', 'categorical', 4.00, '2024-07-23 16:23:02'),
(41, 16, 'x = New Valley', 'categorical', 5.00, '2024-07-23 16:23:02'),
(42, 16, 'x = Minya', 'categorical', 4.00, '2024-07-23 16:23:02'),
(43, 16, 'x = Menoufia', 'categorical', 3.00, '2024-07-23 16:23:02'),
(44, 16, 'x = Qalyubia', 'categorical', 3.00, '2024-07-23 16:23:02'),
(45, 16, 'x = Cairo', 'categorical', 3.00, '2024-07-23 16:23:02'),
(46, 16, 'x = Fayoum', 'categorical', 4.00, '2024-07-23 16:23:02'),
(47, 16, 'x = Gharbia', 'categorical', 2.00, '2024-07-23 16:23:02'),
(48, 16, 'x = Sharqia', 'categorical', 3.00, '2024-07-23 16:23:02'),
(49, 16, 'x = Suez', 'categorical', 2.00, '2024-07-23 16:23:02'),
(50, 10, 'x = male', 'categorical', 120.00, '2024-07-23 21:13:05'),
(51, 15, 'x > 20 and x <= 45', 'compound', 999.99, '2024-07-23 21:18:35');

-- --------------------------------------------------------

--
-- Table structure for table `criteriafields`
--

CREATE TABLE `criteriafields` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `lastEdited` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `criteriafields`
--

INSERT INTO `criteriafields` (`id`, `name`, `type`, `lastEdited`) VALUES
(9, 'cgpa', 'numerical', '2024-07-23 16:13:37'),
(10, 'gender', 'categorical', '2024-07-23 16:13:37'),
(11, 'academicLevel', 'categorical', '2024-07-23 16:13:37'),
(12, 'hasSibling', 'categorical', '2024-07-23 16:13:37'),
(13, 'previouslyLivedInAccommodation', 'categorical', '2024-07-23 16:13:37'),
(14, 'familyResidesOutsideEgypt', 'categorical', '2024-07-23 16:13:37'),
(15, 'highSchoolGrade', 'numerical', '2024-07-23 16:13:37'),
(16, 'governorate', 'categorical', '2024-07-23 16:13:37');

-- --------------------------------------------------------

--
-- Table structure for table `descriptions`
--

CREATE TABLE `descriptions` (
  `id` int(11) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `descriptions`
--

INSERT INTO `descriptions` (`id`, `description`) VALUES
(1, 'bad boy'),
(2, 'ugly gy');

-- --------------------------------------------------------

--
-- Table structure for table `expelledmembers`
--

CREATE TABLE `expelledmembers` (
  `id` int(11) NOT NULL,
  `universityId` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `middleName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `expulsionStatus` enum('temporary','permanent') NOT NULL,
  `expulsionDuration` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expelledmembers`
--

INSERT INTO `expelledmembers` (`id`, `universityId`, `firstName`, `middleName`, `lastName`, `expulsionStatus`, `expulsionDuration`) VALUES
(1, 221101039, 'khaled', 'saeeid', 'zahran', 'temporary', 'Spring 2024');

-- --------------------------------------------------------

--
-- Table structure for table `facultyinfo`
--

CREATE TABLE `facultyinfo` (
  `id` int(11) NOT NULL,
  `memberId` int(11) NOT NULL,
  `faculty` varchar(100) NOT NULL,
  `program` varchar(100) NOT NULL,
  `level` int(11) NOT NULL,
  `cgpa` float DEFAULT NULL,
  `certificateType` varchar(100) DEFAULT NULL,
  `certificateScore` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facultyinfo`
--

INSERT INTO `facultyinfo` (`id`, `memberId`, `faculty`, `program`, `level`, `cgpa`, `certificateType`, `certificateScore`) VALUES
(8, 12, 'Faculty of Textile Science Engineering', 'Textile Polymer & Color Chemistry Engineering Program', 0, 0, 'EgyptianCert', '85.55');

-- --------------------------------------------------------

--
-- Table structure for table `maintenance`
--

CREATE TABLE `maintenance` (
  `id` int(11) NOT NULL,
  `residentId` int(11) NOT NULL,
  `equipment` varchar(50) NOT NULL,
  `requestDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `technician` varchar(100) NOT NULL,
  `completeDate` timestamp NULL DEFAULT NULL,
  `status` enum('pending','complete','inProgress','reject') NOT NULL DEFAULT 'pending',
  `descriptionId` int(11) DEFAULT NULL,
  `rejectDescriptionId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE `member` (
  `id` int(11) NOT NULL,
  `accountId` int(11) NOT NULL,
  `registrationDate` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`id`, `accountId`, `registrationDate`) VALUES
(12, 12, '2024-07-25 09:47:27');

-- --------------------------------------------------------

--
-- Table structure for table `parentinfo`
--

CREATE TABLE `parentinfo` (
  `id` int(11) NOT NULL,
  `memberId` int(11) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `phoneNumber` varchar(20) NOT NULL,
  `parentLocation` enum('local','abroad') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `parentinfo`
--

INSERT INTO `parentinfo` (`id`, `memberId`, `firstName`, `lastName`, `phoneNumber`, `parentLocation`) VALUES
(6, 12, 'Khaled', 'Zahran', '01212939615', 'abroad');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `memberId` int(11) NOT NULL,
  `housingExpenses` decimal(10,2) NOT NULL,
  `insurance` decimal(10,2) NOT NULL,
  `invoicePath` text NOT NULL,
  `status` enum('pending','paid') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `memberId`, `housingExpenses`, `insurance`, `invoicePath`, `status`) VALUES
(4, 12, 12000.00, 4000.00, 'Zahran_223322325_invoice.jpeg', 'paid');

-- --------------------------------------------------------

--
-- Table structure for table `personalinfo`
--

CREATE TABLE `personalinfo` (
  `id` int(11) NOT NULL,
  `memberId` int(11) NOT NULL,
  `universityEmail` varchar(100) NOT NULL,
  `phoneNumber` varchar(20) NOT NULL,
  `birthDate` date NOT NULL,
  `gender` varchar(10) NOT NULL,
  `nationality` varchar(50) NOT NULL,
  `governmentIssuedId` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personalinfo`
--

INSERT INTO `personalinfo` (`id`, `memberId`, `universityEmail`, `phoneNumber`, `birthDate`, `gender`, `nationality`, `governmentIssuedId`) VALUES
(9, 12, 'kjdalkjf223233232@nmu.edu.eg', '01212939615', '2024-07-24', 'female', 'Austrian', '22110133333025');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `residentId` int(11) NOT NULL,
  `roomId` int(11) NOT NULL,
  `reservationDate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `residentId`, `roomId`, `reservationDate`) VALUES
(6, 3, 2, '2024-07-24 22:19:21');

-- --------------------------------------------------------

--
-- Table structure for table `residents`
--

CREATE TABLE `residents` (
  `id` int(11) NOT NULL,
  `memberId` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `occupancyStatus` enum('occupied','vacant') NOT NULL DEFAULT 'vacant'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `residents`
--

INSERT INTO `residents` (`id`, `memberId`, `score`, `occupancyStatus`) VALUES
(3, 12, 15, 'occupied');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  `occupiedStatus` tinyint(1) NOT NULL DEFAULT 0,
  `apartmentId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `number`, `occupiedStatus`, `apartmentId`) VALUES
(2, 10, 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `addressinfo`
--
ALTER TABLE `addressinfo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `administrator`
--
ALTER TABLE `administrator`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accountId` (`accountId`);

--
-- Indexes for table `alert`
--
ALTER TABLE `alert`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_uniId` (`universityId`),
  ADD KEY `descriptionId` (`descriptionId`);

--
-- Indexes for table `apartments`
--
ALTER TABLE `apartments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buildingId` (`buildingId`);

--
-- Indexes for table `buildings`
--
ALTER TABLE `buildings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `criteria`
--
ALTER TABLE `criteria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fieldId` (`fieldId`);

--
-- Indexes for table `criteriafields`
--
ALTER TABLE `criteriafields`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `descriptions`
--
ALTER TABLE `descriptions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expelledmembers`
--
ALTER TABLE `expelledmembers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `facultyinfo`
--
ALTER TABLE `facultyinfo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `maintenance`
--
ALTER TABLE `maintenance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `residentId` (`residentId`),
  ADD KEY `descriptionId` (`descriptionId`),
  ADD KEY `rejectDescriptionId` (`rejectDescriptionId`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`id`),
  ADD KEY `accountId` (`accountId`);

--
-- Indexes for table `parentinfo`
--
ALTER TABLE `parentinfo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `personalinfo`
--
ALTER TABLE `personalinfo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `residentId` (`residentId`),
  ADD KEY `roomId` (`roomId`);

--
-- Indexes for table `residents`
--
ALTER TABLE `residents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `memberId` (`memberId`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `apartmentId` (`apartmentId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `addressinfo`
--
ALTER TABLE `addressinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `administrator`
--
ALTER TABLE `administrator`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `alert`
--
ALTER TABLE `alert`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `apartments`
--
ALTER TABLE `apartments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `buildings`
--
ALTER TABLE `buildings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `criteria`
--
ALTER TABLE `criteria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `criteriafields`
--
ALTER TABLE `criteriafields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `descriptions`
--
ALTER TABLE `descriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `expelledmembers`
--
ALTER TABLE `expelledmembers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `facultyinfo`
--
ALTER TABLE `facultyinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `maintenance`
--
ALTER TABLE `maintenance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `member`
--
ALTER TABLE `member`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `parentinfo`
--
ALTER TABLE `parentinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `personalinfo`
--
ALTER TABLE `personalinfo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `residents`
--
ALTER TABLE `residents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addressinfo`
--
ALTER TABLE `addressinfo`
  ADD CONSTRAINT `addressinfo_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `administrator`
--
ALTER TABLE `administrator`
  ADD CONSTRAINT `administrator_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `alert`
--
ALTER TABLE `alert`
  ADD CONSTRAINT `alert_ibfk_1` FOREIGN KEY (`descriptionId`) REFERENCES `descriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `apartments`
--
ALTER TABLE `apartments`
  ADD CONSTRAINT `apartments_ibfk_1` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `criteria`
--
ALTER TABLE `criteria`
  ADD CONSTRAINT `criteria_ibfk_1` FOREIGN KEY (`fieldId`) REFERENCES `criteriafields` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `facultyinfo`
--
ALTER TABLE `facultyinfo`
  ADD CONSTRAINT `facultyinfo_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `maintenance`
--
ALTER TABLE `maintenance`
  ADD CONSTRAINT `maintenance_ibfk_1` FOREIGN KEY (`residentId`) REFERENCES `residents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `maintenance_ibfk_2` FOREIGN KEY (`descriptionId`) REFERENCES `descriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `maintenance_ibfk_3` FOREIGN KEY (`rejectDescriptionId`) REFERENCES `descriptions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `member`
--
ALTER TABLE `member`
  ADD CONSTRAINT `member_ibfk_1` FOREIGN KEY (`accountId`) REFERENCES `account` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `parentinfo`
--
ALTER TABLE `parentinfo`
  ADD CONSTRAINT `parentinfo_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `personalinfo`
--
ALTER TABLE `personalinfo`
  ADD CONSTRAINT `personalinfo_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`residentId`) REFERENCES `residents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`roomId`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `residents`
--
ALTER TABLE `residents`
  ADD CONSTRAINT `residents_ibfk_1` FOREIGN KEY (`memberId`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`apartmentId`) REFERENCES `apartments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
