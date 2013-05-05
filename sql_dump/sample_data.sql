/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Adatbázis: `projecthost_hu_holvagyok`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet: `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `userId` varchar(255) collate utf8_hungarian_ci NOT NULL,
  `puzzleId` int(10) NOT NULL,
  `isSpoiler` tinyint(1) NOT NULL,
  `content` text collate utf8_hungarian_ci NOT NULL,
  `date` bigint(20) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci AUTO_INCREMENT=9 ;


CREATE TABLE IF NOT EXISTS `puzzles` (
  `id` int(10) unsigned NOT NULL auto_increment,
  `label` text collate utf8_hungarian_ci NOT NULL,
  `question` text collate utf8_hungarian_ci NOT NULL,
  `answer` text collate utf8_hungarian_ci NOT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `heading` double NOT NULL,
  `pitch` double NOT NULL,
  `userId` varchar(255) collate utf8_hungarian_ci NOT NULL,
  `date` bigint(20) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci AUTO_INCREMENT=26 ;

CREATE TABLE IF NOT EXISTS `users` (
  `userId` varchar(255) collate utf8_hungarian_ci NOT NULL,
  `userName` varchar(255) collate utf8_hungarian_ci NOT NULL,
  `image` varchar(512) collate utf8_hungarian_ci NOT NULL,
  `lastLoginDate` bigint(20) NOT NULL,
  `resolves` text collate utf8_hungarian_ci NOT NULL,
  PRIMARY KEY  (`userId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`userId`, `userName`, `image`, `lastLoginDate`, `resolves`) VALUES
('100468970006855573479', 'Kovacs Andras', 'https://lh6.googleusercontent.com/-759fixMuPPs/AAAAAAAAAAI/AAAAAAAAHSY/zRgjhObGeB4/photo.jpg?sz=50', 1367365633398, '{"10":{"score":18},"13":{"score":23},"20":{"score":6},"21":{"score":43},"22":{"score":687},"23":{"score":2956}}'),

CREATE TABLE IF NOT EXISTS `wrongTipps` (
  `puzzleId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `wrongTipp` text collate utf8_hungarian_ci NOT NULL,
  `date` bigint(20) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `wrongTipps`
--

INSERT INTO `wrongTipps` (`puzzleId`, `userId`, `wrongTipp`, `date`) VALUES

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
