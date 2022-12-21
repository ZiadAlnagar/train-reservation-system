-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 12, 2021 at 11:55 PM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 8.0.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `t-rain`
--

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `CityId` int(10) UNSIGNED NOT NULL,
  `Name` varchar(35) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`CityId`, `Name`) VALUES
(1, 'Alex'),
(2, 'Cairo'),
(3, 'New Cairo'),
(4, 'Al Shrok');

-- --------------------------------------------------------

--
-- Table structure for table `coupon`
--

CREATE TABLE `coupon` (
  `CouponId` int(11) NOT NULL,
  `Code` varchar(6) NOT NULL,
  `Amount` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `TicketId` int(11) NOT NULL,
  `UserId` int(11) UNSIGNED NOT NULL,
  `TripId` int(11) NOT NULL,
  `TicketType` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `train`
--

CREATE TABLE `train` (
  `TrainId` int(3) NOT NULL,
  `Seats` tinyint(3) UNSIGNED NOT NULL,
  `DateCreated` date NOT NULL,
  `DateUpdated` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `train`
--

INSERT INTO `train` (`TrainId`, `Seats`, `DateCreated`, `DateUpdated`) VALUES
(1, 10, '0000-00-00', '0000-00-00'),
(2, 15, '0000-00-00', '0000-00-00'),
(3, 20, '0000-00-00', '0000-00-00');

-- --------------------------------------------------------

--
-- Table structure for table `trip`
--

CREATE TABLE `trip` (
  `TripId` int(11) NOT NULL,
  `TrainId` int(11) NOT NULL,
  `Source` int(11) UNSIGNED NOT NULL,
  `Destination` int(11) UNSIGNED NOT NULL,
  `DepartTime` datetime NOT NULL,
  `ArrivalTime` datetime NOT NULL,
  `TicketCost` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `trip`
--

INSERT INTO `trip` (`TripId`, `TrainId`, `Source`, `Destination`, `DepartTime`, `ArrivalTime`, `TicketCost`) VALUES
(1, 1, 2, 1, '2021-06-11 21:09:14', '2021-06-11 21:09:14', 10),
(2, 1, 2, 1, '2021-06-12 21:09:24', '2021-06-13 21:09:24', 15),
(3, 2, 4, 3, '2021-06-11 21:09:14', '2021-06-11 21:09:14', 13.5);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `UserId` int(3) UNSIGNED NOT NULL,
  `AccType` tinyint(1) NOT NULL,
  `FirstName` varchar(32) NOT NULL,
  `LastName` varchar(32) NOT NULL,
  `Email` varchar(254) NOT NULL,
  `Password` varchar(128) NOT NULL,
  `Address` varchar(130) NOT NULL,
  `Phone` varchar(15) NOT NULL,
  `BirthDate` date NOT NULL,
  `CardNo` varchar(19) NOT NULL,
  `MM/YY` varchar(10) NOT NULL,
  `CardPass` tinyint(3) NOT NULL,
  `Wallet` float NOT NULL,
  `NameOnCard` varchar(30) NOT NULL,
  `CVC` tinyint(3) NOT NULL,
  `City` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`UserId`, `AccType`, `FirstName`, `LastName`, `Email`, `Password`, `Address`, `Phone`, `BirthDate`, `CardNo`, `MM/YY`, `CardPass`, `Wallet`, `NameOnCard`, `CVC`, `City`) VALUES
(1, 1, 'Ahmed', 'Al', 'email@', '$2y$10$YbTJSW1EWMzaMtDDhH5VluufFTxF7qVjAKiw1CYwzBQPPBpNCqGau', 'Cairo', '123', '2001-03-06', '123456789', '', 12, 0, '', 0, ''),
(2, 0, 'Ali', '', 'mail@', '$2y$10$rmaxwoH6TGzr71BPz5PPQ.OEZRl13GnMx48I2Rrmd7fsd/mRCVarS', '', '0', '0000-00-00', '', '', 0, 500, '', 0, ''),
(4, 0, 'asd', 'asd', 'user@', '$2y$10$GAYLRI1tc41.Fu3S7gOZAutXMnbZMO9NWiBLMArSLJrDW/RRVwoYu', '', '', '0000-00-00', '', '', 0, 4, '', 0, ''),
(5, 1, 'Mona', 'Adel', 'mona@bue', '$2y$10$a89QQKEkS.jKHYkHvkafc.gwkBoellMmSgwlwB9Hp.9JFaG12pBqe', '', '', '2021-06-11', '', '', 0, 100, '', 0, ''),
(8, 0, 'Fatma', 'Ahmed', 'fatma@bue', '$2y$10$xSquYVm8TwDj0TAql.d6ouV7yTkG8cMAP7V5KGkqtGZpXlwI9q2DG', '', '', '2021-06-15', '', '', 0, 1000, '', 0, ''),
(10, 0, 'Ali', 'Osama', 'ali@bue', '$2y$10$CkwQ7dQelg1xo61GSyOUAesgzis.acLxfnXmSW/xWVxJFXtXkZLzC', '', '', '2021-06-13', '', '', 0, 500, '', 0, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`CityId`);

--
-- Indexes for table `coupon`
--
ALTER TABLE `coupon`
  ADD PRIMARY KEY (`CouponId`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`TicketId`),
  ADD KEY `FKTicket_UserId` (`UserId`),
  ADD KEY `FKTicket_TripId` (`TripId`);

--
-- Indexes for table `train`
--
ALTER TABLE `train`
  ADD PRIMARY KEY (`TrainId`);

--
-- Indexes for table `trip`
--
ALTER TABLE `trip`
  ADD PRIMARY KEY (`TripId`),
  ADD KEY `FKTrip_TrainId` (`TrainId`),
  ADD KEY `FKTripSource_CityId` (`Source`),
  ADD KEY `FKTripDestination_CityId` (`Destination`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UserId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `city`
--
ALTER TABLE `city`
  MODIFY `CityId` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `coupon`
--
ALTER TABLE `coupon`
  MODIFY `CouponId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ticket`
--
ALTER TABLE `ticket`
  MODIFY `TicketId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `train`
--
ALTER TABLE `train`
  MODIFY `TrainId` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `trip`
--
ALTER TABLE `trip`
  MODIFY `TripId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserId` int(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `FKTicket_TripId` FOREIGN KEY (`TripId`) REFERENCES `trip` (`TripId`),
  ADD CONSTRAINT `FKTicket_UserId` FOREIGN KEY (`UserId`) REFERENCES `user` (`UserId`);

--
-- Constraints for table `trip`
--
ALTER TABLE `trip`
  ADD CONSTRAINT `FKTripDestination_CityId` FOREIGN KEY (`Destination`) REFERENCES `city` (`CityId`),
  ADD CONSTRAINT `FKTripSource_CityId` FOREIGN KEY (`Source`) REFERENCES `city` (`CityId`),
  ADD CONSTRAINT `FKTrip_TrainId` FOREIGN KEY (`TrainId`) REFERENCES `train` (`TrainId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
