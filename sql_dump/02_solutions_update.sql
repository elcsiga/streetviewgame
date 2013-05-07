/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
DROP TABLE IF EXISTS `guesses`;

CREATE TABLE IF NOT EXISTS `guesses` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `userId` varchar(255) collate utf8_hungarian_ci NOT NULL,
  `answer` text collate utf8_hungarian_ci NOT NULL,
  `puzzleId` int(10) NOT NULL,
  `score` int(10) NOT NULL,
  `type` int(4) NOT NULL,
  `date` bigint(20) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci AUTO_INCREMENT=9 ;

alter table users drop primary key;
alter table users add id int(10) primary key NOT NULL AUTO_INCREMENT;
