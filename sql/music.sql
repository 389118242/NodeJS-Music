/*
Navicat MySQL Data Transfer

Source Server         : mysql-localhost
Source Server Version : 50713
Source Host           : localhost:3306
Source Database       : music

Target Server Type    : MYSQL
Target Server Version : 50713
File Encoding         : 65001

Date: 2017-04-24 17:13:21
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address` (
  `addressId` int(11) NOT NULL,
  `addressName` varchar(45) DEFAULT NULL,
  `parentId` int(11) DEFAULT NULL,
  PRIMARY KEY (`addressId`),
  KEY `fk_adId_address_parentId` (`parentId`),
  CONSTRAINT `fk_adId_address_parentId` FOREIGN KEY (`parentId`) REFERENCES `address` (`addressId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for album
-- ----------------------------
DROP TABLE IF EXISTS `album`;
CREATE TABLE `album` (
  `albumId` int(11) NOT NULL AUTO_INCREMENT,
  `singerId` int(11) NOT NULL,
  `albumName` varchar(50) NOT NULL,
  `issueCompany` int(11) NOT NULL,
  `issueTime` date NOT NULL,
  `albumDetail` longtext NOT NULL,
  `resourceId` int(11) DEFAULT NULL COMMENT 'albumImg',
  PRIMARY KEY (`albumId`),
  KEY `fk_album_sId_singerId` (`singerId`),
  KEY `fk_album_ic_company_id` (`issueCompany`),
  CONSTRAINT `fk_album_ic_company_id` FOREIGN KEY (`issueCompany`) REFERENCES `record_company` (`rcId`),
  CONSTRAINT `fk_album_sId_singerId` FOREIGN KEY (`singerId`) REFERENCES `singer` (`singerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for alb_com_relation
-- ----------------------------
DROP TABLE IF EXISTS `alb_com_relation`;
CREATE TABLE `alb_com_relation` (
  `albId` int(11) NOT NULL,
  `comId` int(11) NOT NULL,
  PRIMARY KEY (`albId`,`comId`),
  KEY `fk_ac_relation_comId_com_id` (`comId`),
  CONSTRAINT `ac_relation_albId_album_id` FOREIGN KEY (`albId`) REFERENCES `album` (`albumId`),
  CONSTRAINT `fk_ac_relation_comId_com_id` FOREIGN KEY (`comId`) REFERENCES `comment` (`comId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for collection
-- ----------------------------
DROP TABLE IF EXISTS `collection`;
CREATE TABLE `collection` (
  `listId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`listId`,`userId`),
  KEY `fk_collection_uId_user_id` (`userId`),
  CONSTRAINT `fk_collection_listId_sl_id` FOREIGN KEY (`listId`) REFERENCES `song_list` (`listId`),
  CONSTRAINT `fk_collection_uId_user_id` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `comId` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `comContent` longtext,
  `likeNum` int(11) DEFAULT '0',
  `parentId` int(11) DEFAULT NULL,
  PRIMARY KEY (`comId`),
  KEY `fk_comment_uId_user_id` (`userId`),
  CONSTRAINT `fk_comment_uId_user_id` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for list_kind
-- ----------------------------
DROP TABLE IF EXISTS `list_kind`;
CREATE TABLE `list_kind` (
  `kindId` int(11) NOT NULL AUTO_INCREMENT,
  `kindName` varchar(23) NOT NULL,
  PRIMARY KEY (`kindId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `messId` int(11) NOT NULL AUTO_INCREMENT,
  `sendUserId` int(11) DEFAULT NULL,
  `messType` varchar(45) DEFAULT NULL,
  `receiveUserId` int(11) DEFAULT NULL,
  `messContent` longtext,
  `isRead` int(11) DEFAULT '0',
  PRIMARY KEY (`messId`),
  KEY `fk_mess_sendId_user_id` (`sendUserId`),
  KEY `fk_mess_receiveId_user_id` (`receiveUserId`),
  CONSTRAINT `fk_mess_receiveId_user_id` FOREIGN KEY (`receiveUserId`) REFERENCES `user` (`userId`),
  CONSTRAINT `fk_mess_sendId_user_id` FOREIGN KEY (`sendUserId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for recommend_song
-- ----------------------------
DROP TABLE IF EXISTS `recommend_song`;
CREATE TABLE `recommend_song` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `songId` int(11) DEFAULT NULL,
  `sort` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_recom_song_songId_song_songId` (`songId`),
  CONSTRAINT `fk_recom_song_songId_song_songId` FOREIGN KEY (`songId`) REFERENCES `song` (`songId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for recommend_song_list
-- ----------------------------
DROP TABLE IF EXISTS `recommend_song_list`;
CREATE TABLE `recommend_song_list` (
  `index` int(11) NOT NULL,
  `slId` int(11) DEFAULT NULL,
  `img` varchar(39) DEFAULT NULL,
  `detail` varchar(3) DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for record_company
-- ----------------------------
DROP TABLE IF EXISTS `record_company`;
CREATE TABLE `record_company` (
  `rcId` int(11) NOT NULL AUTO_INCREMENT,
  `companyName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`rcId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for resource
-- ----------------------------
DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data` longblob,
  `extension` varchar(125) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for singer
-- ----------------------------
DROP TABLE IF EXISTS `singer`;
CREATE TABLE `singer` (
  `singerId` int(11) NOT NULL AUTO_INCREMENT,
  `singerName` varchar(45) DEFAULT NULL,
  `resourceId` int(11) DEFAULT NULL COMMENT 'singerImg',
  `singerDetail` longtext,
  PRIMARY KEY (`singerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for sl_com_relation
-- ----------------------------
DROP TABLE IF EXISTS `sl_com_relation`;
CREATE TABLE `sl_com_relation` (
  `slId` int(11) NOT NULL,
  `comId` int(11) NOT NULL,
  PRIMARY KEY (`slId`,`comId`),
  KEY `fk_sc_relation_comId_com_id` (`comId`),
  CONSTRAINT `fk_sc_relation_comId_com_id` FOREIGN KEY (`comId`) REFERENCES `comment` (`comId`),
  CONSTRAINT `fk_sc_relation_slId_sl_id` FOREIGN KEY (`slId`) REFERENCES `song_list` (`listId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for sl_lk_relation
-- ----------------------------
DROP TABLE IF EXISTS `sl_lk_relation`;
CREATE TABLE `sl_lk_relation` (
  `slId` int(11) NOT NULL,
  `lkId` int(11) NOT NULL,
  PRIMARY KEY (`slId`,`lkId`),
  KEY `fk_sl_relation_lkId_lk_id` (`lkId`),
  CONSTRAINT `fk_sl_relation_lkId_lk_id` FOREIGN KEY (`lkId`) REFERENCES `list_kind` (`kindId`),
  CONSTRAINT `fk_sl_relation_slId_sl_id` FOREIGN KEY (`slId`) REFERENCES `song_list` (`listId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for sl_song_relation
-- ----------------------------
DROP TABLE IF EXISTS `sl_song_relation`;
CREATE TABLE `sl_song_relation` (
  `slId` int(11) NOT NULL,
  `songId` int(11) NOT NULL,
  PRIMARY KEY (`slId`,`songId`),
  KEY `fk_ssr_songId_song_id` (`songId`),
  CONSTRAINT `fk_ssr_slId_sl_id` FOREIGN KEY (`slId`) REFERENCES `song_list` (`listId`),
  CONSTRAINT `fk_ssr_songId_song_id` FOREIGN KEY (`songId`) REFERENCES `song` (`songId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for song
-- ----------------------------
DROP TABLE IF EXISTS `song`;
CREATE TABLE `song` (
  `songId` int(11) NOT NULL AUTO_INCREMENT,
  `songName` varchar(45) DEFAULT NULL,
  `singerId` int(11) DEFAULT NULL,
  `albumId` int(11) DEFAULT NULL,
  `lyric` longtext,
  `songTime` varchar(9) DEFAULT NULL,
  `playNum` int(11) DEFAULT '0',
  `resourceId` int(11) DEFAULT NULL COMMENT 'music file (e.g. mp3 file)',
  PRIMARY KEY (`songId`),
  KEY `fk_song_sId_singer_id` (`singerId`),
  KEY `fk_song_aId_album_id` (`albumId`),
  CONSTRAINT `fk_song_aId_album_id` FOREIGN KEY (`albumId`) REFERENCES `album` (`albumId`),
  CONSTRAINT `fk_song_sId_singer_id` FOREIGN KEY (`singerId`) REFERENCES `singer` (`singerId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for song_com_relation
-- ----------------------------
DROP TABLE IF EXISTS `song_com_relation`;
CREATE TABLE `song_com_relation` (
  `songId` int(11) NOT NULL,
  `comId` int(11) NOT NULL,
  PRIMARY KEY (`songId`,`comId`),
  KEY `fk_sc_relation_cId` (`comId`),
  CONSTRAINT `fk_sc_relation_cId` FOREIGN KEY (`comId`) REFERENCES `comment` (`comId`),
  CONSTRAINT `fk_sc_relation_sId_song_id` FOREIGN KEY (`songId`) REFERENCES `song` (`songId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for song_list
-- ----------------------------
DROP TABLE IF EXISTS `song_list`;
CREATE TABLE `song_list` (
  `listId` int(11) NOT NULL AUTO_INCREMENT,
  `listName` varchar(50) NOT NULL,
  `listDetail` longtext,
  `listImg` varchar(39) DEFAULT 'images/user_default.png',
  `userId` int(11) NOT NULL,
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `collectionNum` int(11) DEFAULT '0',
  `playNum` int(11) DEFAULT '0',
  PRIMARY KEY (`listId`),
  KEY `fk_song_list_uId_user_id` (`userId`),
  CONSTRAINT `fk_song_list_uId_user_id` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userAccount` varchar(20) NOT NULL,
  `userPassword` varchar(39) NOT NULL,
  `userName` varchar(20) NOT NULL,
  `userImg` longtext,
  `userDetail` longtext,
  `userGender` int(11) DEFAULT '1',
  `userBirthDay` date DEFAULT NULL,
  `userAddress` int(11) DEFAULT NULL,
  `userEmail` varchar(20) DEFAULT NULL,
  `userState` int(11) DEFAULT '1',
  `registerDate` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userAccount_UNIQUE` (`userAccount`),
  KEY `fk_user_aId_add_id` (`userAddress`),
  CONSTRAINT `fk_user_aId_add_id` FOREIGN KEY (`userAddress`) REFERENCES `address` (`addressId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
SET FOREIGN_KEY_CHECKS=1;
