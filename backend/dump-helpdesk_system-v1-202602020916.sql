/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.1.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: helpdesk_system
-- ------------------------------------------------------
-- Server version	12.1.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `cases`
--

DROP TABLE IF EXISTS `cases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cases` (
  `case_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `technician_id` int(11) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `status_id` int(11) NOT NULL,
  `categories_id` int(11) DEFAULT NULL,
  `instance_id` int(11) DEFAULT NULL,
  `case_title` varchar(255) DEFAULT NULL,
  `case_detail` varchar(255) NOT NULL,
  `case_resolution` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `assigned_date` timestamp NULL DEFAULT NULL,
  `work_completed_date` datetime DEFAULT NULL,
  `closed_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`case_id`),
  KEY `technician` (`technician_id`),
  KEY `user` (`user_id`),
  KEY `manager` (`manager_id`),
  KEY `status` (`status_id`),
  KEY `Cases_Categoriesdevice_FK` (`categories_id`),
  KEY `Cases_DeviceInstances_FK` (`instance_id`),
  CONSTRAINT `Cases_Categoriesdevice_FK` FOREIGN KEY (`categories_id`) REFERENCES `issue_categories` (`id`),
  CONSTRAINT `Cases_DeviceInstances_FK` FOREIGN KEY (`instance_id`) REFERENCES `device_instances` (`instance_id`),
  CONSTRAINT `manager` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `status` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`),
  CONSTRAINT `technician` FOREIGN KEY (`technician_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cases`
--

LOCK TABLES `cases` WRITE;
/*!40000 ALTER TABLE `cases` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `cases` VALUES
(107,122,120,121,4,1,NULL,'Test Case Title','Test Case Detail',NULL,'2026-01-14 20:43:13',NULL,NULL,NULL),
(108,122,NULL,121,1,1,NULL,'Test Case Title','aa',NULL,'2026-01-14 22:21:07',NULL,NULL,NULL);
/*!40000 ALTER TABLE `cases` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `dep_id` int(11) NOT NULL AUTO_INCREMENT,
  `dep_name` varchar(255) NOT NULL,
  PRIMARY KEY (`dep_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `departments` VALUES
(1,'ไอที'),
(2,'บัญชี');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `device_instances`
--

DROP TABLE IF EXISTS `device_instances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_instances` (
  `instance_id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) DEFAULT NULL,
  `serial_number` varchar(100) NOT NULL,
  `device_number` int(11) DEFAULT NULL,
  `dep_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`instance_id`),
  UNIQUE KEY `DeviceInstances_UNIQUE` (`serial_number`),
  UNIQUE KEY `DeviceInstances_UNIQUE_1` (`device_number`,`device_id`),
  KEY `DeviceInstances_Device_FK` (`device_id`),
  KEY `DeviceInstances_Department_FK` (`dep_id`),
  CONSTRAINT `DeviceInstances_Department_FK` FOREIGN KEY (`dep_id`) REFERENCES `departments` (`dep_id`),
  CONSTRAINT `DeviceInstances_Device_FK` FOREIGN KEY (`device_id`) REFERENCES `devices` (`dev_id`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_instances`
--

LOCK TABLES `device_instances` WRITE;
/*!40000 ALTER TABLE `device_instances` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `device_instances` VALUES
(98,2,'ABC1234',1,2),
(99,NULL,'dsa',1,1),
(101,3,'dasdasd',1,1),
(102,3,'adsd',2,NULL),
(109,1,'cxzc123',1,1),
(115,1,'abc2',2,NULL);
/*!40000 ALTER TABLE `device_instances` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `device_types`
--

DROP TABLE IF EXISTS `device_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_types` (
  `devicetype_id` int(11) NOT NULL AUTO_INCREMENT,
  `devicetype_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`devicetype_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_types`
--

LOCK TABLES `device_types` WRITE;
/*!40000 ALTER TABLE `device_types` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `device_types` VALUES
(1,'Notebook'),
(2,'Printer'),
(3,'PC'),
(4,'Monitor'),
(6,'dsadsa');
/*!40000 ALTER TABLE `device_types` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `devices` (
  `dev_id` int(11) NOT NULL AUTO_INCREMENT,
  `dev_name` varchar(255) NOT NULL,
  `dev_type` int(11) DEFAULT NULL,
  PRIMARY KEY (`dev_id`),
  KEY `Devices_DeviceType_FK` (`dev_type`),
  CONSTRAINT `Devices_DeviceType_FK` FOREIGN KEY (`dev_type`) REFERENCES `device_types` (`devicetype_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `devices` VALUES
(1,'Asus Gaming V16 V3607VM-RP524W Black',1),
(2,'HP Inkjet Advantage 2875 ',2),
(3,'Epson Ink Tank L3250',2),
(4,'LENOVO DESKTOP AIO 24IRH9-F0HN00Q1TA Grey',3),
(5,'ACER DESKTOP AIO Aspire C24-2G-R516G0T23Mi/T001 Black',3),
(6,'Microsoft Surface Laptop 7 13 inch Pls/16/256 Win11 Platinum',1),
(25,'NOTEBOOK (โน้ตบุ๊ค) ASUS VIVOBOOK GO 15 X1504GA-NJ322W (MIXED BLACK)',1),
(26,'NOTEBOOK (โน้ตบุ๊ค) ASUS VIVOBOOK GO 15 X1504GA-NJ322W (MIXED BLACK)',2);
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `issue_categories`
--

DROP TABLE IF EXISTS `issue_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `issue_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `issue_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issue_categories`
--

LOCK TABLES `issue_categories` WRITE;
/*!40000 ALTER TABLE `issue_categories` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `issue_categories` VALUES
(1,'คอมพิวเตอร์'),
(2,'โปรเจคเตอร์'),
(3,'อินเทอร์เน็ต'),
(4,'อื่นๆ');
/*!40000 ALTER TABLE `issue_categories` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(255) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `roles` VALUES
(1,'admin'),
(2,'manager'),
(3,'technician'),
(4,'user');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `status` (
  `status_id` int(11) NOT NULL AUTO_INCREMENT,
  `status_name` varchar(255) NOT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

LOCK TABLES `status` WRITE;
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `status` VALUES
(1,'แจ้งปัญหาใหม่'),
(2,'มอบหมายให้ช่าง'),
(3,'กำลังทำ'),
(4,'ทำเสร็จแล้วรอการยืนยัน'),
(5,'เสร็จสิ้น');
/*!40000 ALTER TABLE `status` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `ticket_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `resolution_note` varchar(255) DEFAULT NULL,
  `issue_categories_id` int(11) DEFAULT NULL,
  `instance_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `technician_id` int(11) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `status_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `assigned_at` datetime DEFAULT NULL,
  `started_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `closed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `Cases_Categoriesdevice_FK` (`issue_categories_id`) USING BTREE,
  KEY `Cases_DeviceInstances_FK` (`instance_id`) USING BTREE,
  KEY `manager` (`manager_id`) USING BTREE,
  KEY `status` (`status_id`) USING BTREE,
  KEY `technician` (`technician_id`) USING BTREE,
  KEY `user` (`user_id`) USING BTREE,
  CONSTRAINT `Cases_Categoriesdevice_FK_copy` FOREIGN KEY (`issue_categories_id`) REFERENCES `issue_categories` (`id`),
  CONSTRAINT `Cases_DeviceInstances_FK_copy` FOREIGN KEY (`instance_id`) REFERENCES `device_instances` (`instance_id`),
  CONSTRAINT `manager_copy` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `status_copy` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`),
  CONSTRAINT `technician_copy` FOREIGN KEY (`technician_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_copy` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `tickets` VALUES
(44,'eieinaja','sdz',NULL,1,NULL,122,120,121,3,'2026-01-25 05:36:38','2026-01-26 05:40:47','2026-01-31 02:04:12',NULL,NULL),
(45,'123','123','testeiei',2,98,122,120,121,4,'2026-01-25 05:37:12','2026-01-26 05:12:32',NULL,'2026-01-29 10:19:06',NULL);
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `avatar_path` longblob DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `role` (`role_id`),
  KEY `dep_id` (`department_id`),
  CONSTRAINT `dep_id` FOREIGN KEY (`department_id`) REFERENCES `departments` (`dep_id`),
  CONSTRAINT `role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `users` VALUES
(56,'knssss234','$2a$10$d1ldoO21X4VLUfeniV/v6Olo4GeAZIidVwmPlqcIfA6rlezMKFFNe','kns','dasd','dasdsadsa','dsadasd',1,1,NULL,1),
(99,'nonknseiei','$2a$10$hG3gyLvfX39fbqmYGwBqDuXpTItZlBZ5FNF3pQRim0QIcSLdEUWs2','kns','dasd','1234','',2,1,NULL,1),
(106,'admin','$2a$10$crvPzxGsiEaAUofpTJv2R.DT81PRt2xBqY2WLSgnmC32Pcqn/qbrC','kns','dasd','dasdsadsa','dsadasd',1,1,NULL,1),
(108,'eiei1','$2a$10$L6/9qBe/ONBIlkULxrK9huS62q/QU6nBDPKaejHcnT735YIBiT.AW','dsa','das','es','123',1,1,NULL,1),
(118,'dasdas','$2a$10$fwVeq8GrSIl2MLj06RPMIu6t.6iKRnuf/0z32gCWRiSRuSUwbR3tO','asdas','d','das','das',1,1,NULL,1),
(119,'user','$2a$10$wtgGDRkVQuJ1jNzClH5dZOHH8Qw4oTG0I9C2niGFWh4JCN89S9KFy','dsa','das','es','123',4,1,NULL,1),
(120,'t','$2a$10$2Ey5gsQN0cF9mEqGvS1yHu40veRKSzCy2nVfASL5BOYPoZL18niP2','dsa','das','es','123',3,1,NULL,1),
(121,'m','$2a$10$ivdl3GCNwu2Si7wjxTfXNeuOlJRiLwYv4CiwbYd6WTYVnt.bRVOJa','dsa','das','es','123',2,1,NULL,1),
(122,'u','$2a$10$pDnDGUpssmmuxIlsV2DeKuQqREJw206G0J4bpbbsPoxmpZeC8dUDi','dsa','das','es','123',4,1,NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Dumping routines for database 'helpdesk_system'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-02-02  9:16:25
