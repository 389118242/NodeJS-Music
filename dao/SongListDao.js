/**
 * Created by Win on 2017/3/19.
 */
var utils = require('../utils');

exports.insert = function (songList, fn) {
    var conn = utils.getConnection();
    conn.query("insert into song_list set ?", songList, utils.insertOrUpdateResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectCreated = function (userId, fn) {
    var conn = utils.getConnection();
    conn.query("select * from song_list where userId=? order by listId", [userId], utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectCollection = function (userId, fn) {
    var conn = utils.getConnection();
    conn.query("select * from song_list where listId in (select listId from collection where userId = ?)", [userId], utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectWithSongNumByUserId = function (userId, fn) {
    var conn = utils.getConnection();
    conn.query("SELECT t1.listId,t1.listName,t1.listImg,COUNT(t2.songId) num " +
        "FROM song_list t1 LEFT JOIN sl_song_relation t2 ON t1.listId = t2.slId " +
        "where t1.userId = ? " +
        "GROUP BY listId,listName,listImg", userId, utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.insertSongAndSLRelation = function (slId, songId, fn) {
    var conn = utils.getConnection();
    conn.query("insert into sl_song_relation set ?", {
        slId: slId,
        songId: songId
    }, utils.insertOrUpdateResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectBySongListId = function (songListId, fn) {
    var conn = utils.getConnection();
    conn.query("select s.*,u.userName from song_list s,user u where s.userId = u.userId and listId = ?", songListId, utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectKindBySongListId = function (songListId, fn) {
    var conn = utils.getConnection();
    conn.query("SELECT kindName FROM list_kind WHERE kindId in (SELECT lkId FROM sl_lk_relation WHERE slId = ?)", songListId, utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectSongsBySongListId = function (songListId, fn) {
    var conn = utils.getConnection();
    conn.query("select songId,songName,songTime,si.singerId,si.singerName from song so,singer si where songId in (select songId from sl_song_relation where slId = ?) and so.singerId = si.singerId", songListId, utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectSongIdBySongListId = function (songListId, fn) {
    var conn = utils.getConnection();
    conn.query("select songId from sl_song_relation where slId = ?", songListId, utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.updatePlayNum = function (songListId) {
    var conn = utils.getConnection();
    conn.query("update song_list set playNum = playNum + 1 where listId = ?", songListId);
    utils.endConnection(conn);
}

exports.selectByKindId = function (kindId, page, size, fn) {
    var conn = utils.getConnection();
    var sql_all = "select listId,listName,listImg,s.userId,userName from song_list s,user u where listName <> '我喜欢的音乐' and s.userId = u.userId";
    var sql_with_kindId = sql_all + " and listId in (select slId from sl_lk_relation where lkId = ?)";
    var limit = " limit ?,?";
    var param = [];
    var sql;
    if (kindId) {
        sql = sql_with_kindId + limit;
        param.push(kindId, (page - 1) * size, size);
    } else {
        sql = sql_all + limit;
        param.push((page - 1) * size, size);
    }
    conn.query(sql, param, utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectCountByKindId = function (kindId, fn) {
    var conn = utils.getConnection();
    var sql_all = "select count(*) num from song_list where listName <> '我喜欢的音乐'";
    var sql_with_kindId = sql_all + " and listId in (select slId from sl_lk_relation where lkId = ?)";
    var sql = kindId ? sql_with_kindId : sql_all;
    conn.query(sql, kindId, utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectCountByKeyword = function (keyword, fn) {
    var conn = utils.getConnection();
    conn.query("select count(*) num from song_list where listName like ? and listName <> '我喜欢的音乐'", '%' + keyword + '%', utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectByKeyword = function (keyword, page, size, fn) {
    var conn = utils.getConnection();
    var query = conn.query("select t.*,COUNT(r.songId) num " +
        "from (select listId,listName,collectionNum,playNum,u.userId,userName,listImg from song_list s,user u " +
        "where s.userId=u.userId and listName like ? and listName <> '我喜欢的音乐' order by listId) t " +
        "LEFT JOIN sl_song_relation r ON t.listId=r.slId GROUP BY listId,listName,collectionNum,playNum,userId,userName,listImg limit ?,?", ['%' + keyword + '%', (page - 1) * size, size], utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectKindByListId = function (songListId, fn) {
    var conn = utils.getConnection();
    conn.query("select * from list_kind where kindId in (select lkId from sl_lk_relation where slId = ?)", songListId, utils.selectResultHandler(fn));
    utils.endConnection(conn);
}