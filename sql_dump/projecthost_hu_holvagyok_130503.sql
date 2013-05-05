-- MySQL dump 10.14  Distrib 5.5.30-MariaDB, for Linux (i686)
--
-- Host: localhost    Database: svg
-- ------------------------------------------------------
-- Server version	5.5.30-MariaDB-log
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `puzzleId` int(10) NOT NULL,
  `isSpoiler` tinyint(1) NOT NULL,
  `content` text COLLATE utf8_hungarian_ci NOT NULL,
  `date` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (2,'100468970006855573479',12,0,'megtaláltam a buszmegállót :)',1367104355256),(3,'100468970006855573479',13,0,'Fel lehet ugrani a hídra :)',1367224958808),(8,'100468970006855573479',11,0,'NEM a település neve a kérdés itt!',1367274379993);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puzzles`
--

DROP TABLE IF EXISTS `puzzles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `puzzles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `label` text COLLATE utf8_hungarian_ci NOT NULL,
  `question` text COLLATE utf8_hungarian_ci NOT NULL,
  `answer` text COLLATE utf8_hungarian_ci NOT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `heading` double NOT NULL,
  `pitch` double NOT NULL,
  `userId` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `date` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puzzles`
--

LOCK TABLES `puzzles` WRITE;
/*!40000 ALTER TABLE `puzzles` DISABLE KEYS */;
INSERT INTO `puzzles` VALUES (7,'Bogaras','Ott egy krumplibogár. De mi a város neve?','Hédervár',47.831097,17.454885,140.05980070415,0.887436032739227,'100468970006855573479',0),(8,'Csapos','Hol járunk?','Miskolc',48.096111,20.763152,-155.930938166798,-32.8051179792111,'100468970006855573479',0),(9,'Lápos','Melyik település közelében található ez a láperdő?','Ócsa',47.271259,19.233874,57.0504532515902,-3.71360257993492,'100468970006855573479',0),(10,'Hidas','Hol járunk?','Esztergom',47.793963,18.739116,-155.215974568735,-10.0247027734348,'100468970006855573479',0),(11,'Tavas','Ki itt a helyi Kossuth-díjas?','Lovasi András',46.151367,18.141758,-105.059908565929,-9.57511033724027,'100468970006855573479',0),(12,'Mezőváros','A város neve','Hajdúböszörmény',47.673327,21.507196,-1212.39703471179,0,'12345',0),(13,'matuska','A falu neve','Kőröshegy',46.816555,17.9078440000001,-85.789896657027,3.61898690796889,'56789',0),(21,'Templomos','Mi a város neve','Zsámbék',47.545383,18.715155,40,0,'101194607509771171602',1367484346541),(22,'vallásközi','Kinek a szívét temetették el ide?','Szulejmán',46.06946,17.826468,102.079630007165,8.25962497495023,'110554436096146952308',1367492485504),(23,'egyesülés','A két város neve (szimplán vesszővel elválasztva):','Tiszaabád, Tiszaszalók',47.476291,20.592451,-86.6745366947404,-0.536791699359985,'110554436096146952308',1367496144483),(24,'Táncos','Mi a falu táncainak jellemző kelléke?','Kendő',46.702245,24.626749,102.957481572183,-5.58449113628158,'100468970006855573479',1367532297746),(25,'dűlő','Hány méter a legmagasabb pont 2 km-en belül, Balti tenger felett? (10-re kerekítve)','300',47.571515,19.042835,1385.88702811105,-0.111884389083529,'102344906090797723176',1367567431491);
/*!40000 ALTER TABLE `puzzles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `userId` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `userName` varchar(255) COLLATE utf8_hungarian_ci NOT NULL,
  `image` varchar(512) COLLATE utf8_hungarian_ci NOT NULL,
  `lastLoginDate` bigint(20) NOT NULL,
  `resolves` text COLLATE utf8_hungarian_ci NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('100468970006855573479','Kovács András','https://lh6.googleusercontent.com/-759fixMuPPs/AAAAAAAAAAI/AAAAAAAAHSY/zRgjhObGeB4/photo.jpg?sz=50',1367365633398,'{\"10\":{\"score\":18},\"13\":{\"score\":23},\"20\":{\"score\":6},\"21\":{\"score\":43},\"22\":{\"score\":687},\"23\":{\"score\":2956}}'),('56789','Elek Marton','',0,''),('12345','Andirko Denes','',0,''),('101194607509771171602','Andirkó Dénes','https://lh4.googleusercontent.com/-V8oaYOUthQM/AAAAAAAAAAI/AAAAAAAAB9o/51StnfQEPE8/photo.jpg?sz=50',1367483600702,'{\"7\":{\"score\":68},\"12\":{\"score\":13},\"13\":{\"score\":97}}'),('110554436096146952308','László Elek','https://lh6.googleusercontent.com/-FHfHObt20ug/AAAAAAAAAAI/AAAAAAAABCY/baA_9iAVlNQ/photo.jpg?sz=50',1367492033701,'{\"7\":{\"score\":125},\"8\":{\"score\":26},\"9\":{\"score\":6},\"10\":{\"score\":6},\"11\":{\"score\":408},\"12\":{\"score\":33},\"13\":{\"score\":56},\"21\":{\"score\":26},\"24\":{\"score\":196}}'),('117521492828353702542','Illés Papp','https://lh3.googleusercontent.com/-3_B_5PvEwIs/AAAAAAAAAAI/AAAAAAAADqM/Sqm9D131lxU/photo.jpg?sz=50',1367518345962,''),('116970004977969517646','Elek Márton','https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50',1367526067654,'{\"25\":{\"score\":421},\"24\":{\"score\":27},\"23\":{\"score\":139},\"22\":{\"score\":591},\"11\":{\"score\":7},\"9\":{\"score\":4},\"10\":{\"score\":9},\"21\":{\"score\":33}}'),('102344906090797723176','Péter Baksa','https://lh3.googleusercontent.com/-5SyhEuJFg3o/AAAAAAAAAAI/AAAAAAAAAFE/DM20L6fcxIc/photo.jpg?sz=50',1367563126785,'{\"11\":{\"score\":52},\"10\":{\"score\":22},\"9\":{\"score\":261},\"7\":{\"score\":125},\"8\":{\"score\":313},\"12\":{\"score\":319},\"13\":{\"score\":141},\"21\":{\"score\":175},\"22\":{\"score\":10},\"23\":{\"score\":247},\"24\":{\"score\":404},\"25\":{\"score\":330}}');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wrongTipps`
--

DROP TABLE IF EXISTS `wrongTipps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wrongTipps` (
  `puzzleId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `wrongTipp` text COLLATE utf8_hungarian_ci NOT NULL,
  `date` bigint(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wrongTipps`
--

LOCK TABLES `wrongTipps` WRITE;
/*!40000 ALTER TABLE `wrongTipps` DISABLE KEYS */;
INSERT INTO `wrongTipps` VALUES (13,0,'Kőröshegy_r',1367273916472),(11,0,'orfű',1367356667417),(11,2147483647,'orfű',1367274428782),(11,2147483647,'orfű',1367356818541),(11,2147483647,'Loavsi András',1367441267073),(9,2147483647,'óxsa',1367444830503),(13,0,'kőrőshegy',1367491213313),(11,0,'Jókai Anna',1367491488238),(11,0,'Bertók László',1367491636598),(23,2147483647,'abád, szalók',1367527006342),(23,2147483647,'abádszalók, kisköre',1367527026468),(23,2147483647,'kisköre, abádszalók',1367527044348),(23,2147483647,'abádszalók, tiszafüred',1367527144094),(23,2147483647,'tiszafüred, abádszalók',1367527157894),(23,2147483647,'abádszalók, kunhegyes',1367528411098),(23,2147483647,'kunhegyes, abádszalók',1367528427405),(24,2147483647,'bot',1367538602729),(9,2147483647,'budapest',1367563411502),(8,2147483647,'komló',1367563506094),(8,2147483647,'ózd',1367563513196),(8,2147483647,'tatabánya',1367563522332),(8,2147483647,'szekszárd',1367563776681),(8,2147483647,'budapest',1367564753023),(13,2147483647,'köröshegy',1367565197588),(13,2147483647,'köröshegy',1367565220704),(13,2147483647,'kereki',1367565225100),(13,2147483647,'szántód',1367565231963),(13,2147483647,'szántód-köröshegy',1367565292214),(13,2147483647,'szántód-kőröshegy',1367565298474),(13,2147483647,'biatorbágy',1367565308020),(13,2147483647,'tihany',1367565314714),(22,2147483647,'jézus',1367565587045),(22,2147483647,'zrínyi',1367565712741),(22,2147483647,'Zrínyi Miklós',1367565728420),(22,2147483647,'Ali Baba',1367565762435),(23,2147483647,'Abád, Szalók',1367566005391),(23,2147483647,'abád, szalók',1367566015743),(24,2147483647,'csárda',1367566390995),(25,2147483647,'495',1367571220847),(25,2147483647,'497',1367571243778),(25,2147483647,'500',1367571290245),(8,2147483647,'miskolci',1367573502127),(8,2147483647,'miskolci',1367573563745),(8,2147483647,'kolcmis',1367573578696),(8,2147483647,'miskolrt',1367573587944),(8,2147483647,'misk',1367573599705),(8,2147483647,'misolc',1367573616776),(8,2147483647,'m',1367573634464),(9,2147483647,'ócs',1367574152207),(9,2147483647,'ó',1367574200675),(9,2147483647,'ocsi',1367574204635),(9,2147483647,'ocsa',1367574207955),(9,2147483647,'óca',1367574222691),(9,2147483647,'kit',1367574231098),(25,2147483647,'180',1367579706304),(25,2147483647,'190',1367579712510),(25,2147483647,'200',1367579716422),(25,2147483647,'170',1367579721576),(25,2147483647,'160',1367579724911),(25,2147483647,'150',1367579728320),(25,2147483647,'230',1367579856954),(25,2147483647,'240',1367579859122),(25,2147483647,'250',1367579860971),(25,2147483647,'260',1367579862418),(25,2147483647,'200',1367579863770),(25,2147483647,'210',1367579865050),(25,2147483647,'220',1367579866786),(25,2147483647,'260',1367579870843),(25,2147483647,'270',1367579872131),(25,2147483647,'280',1367579873299),(25,2147483647,'290',1367579874388),(23,2147483647,'abád,szalók',1367580018887),(23,2147483647,'Tiszaabádból,tiszaszalók',1367580063865),(23,2147483647,'Tiszaabád,tiszaszalók',1367580073312),(23,2147483647,'Tiszaabád,Tiszaszalók',1367580083700);
/*!40000 ALTER TABLE `wrongTipps` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-05-05 21:11:24
