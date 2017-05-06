/**
 * Created by Win on 2017/3/19.
 */
var utils = require('../utils');

exports.selectSongsOfTop9 = function (fn) {
    var conn = utils.getConnection();
    conn.query("select so.songId,so.songName,so.singerId,s.singerName,a.resourceId " +
        "from song so,singer s,album a " +
        "where so.singerId = s.singerId and a.albumId = so.albumId " +
        "ORDER BY playNum DESC limit 0,9", utils.selectResultHandlerAndGenerateImg(fn));
    utils.endConnection(conn);
}

exports.selectRecommendSongs = function (index, fn) {
    var conn = utils.getConnection();
    conn.query("select so.songId,so.songName,so.singerId,s.singerName,a.resourceId from song so,singer s,album a,recommend_song r where so.singerId = s.singerId and a.albumId = so.albumId and so.songId = r.songId order by r.sort,r.id limit ?,8", [(index - 1) * 10], utils.selectResultHandlerAndGenerateImg(fn));
    utils.endConnection(conn);
}

// TODO 生成文件
exports.selectBySongId = function (songId, fn) {
    var conn = utils.getConnection();
    conn.query("select songId,songName,singerName,so.resourceId,lyric from song so,singer si where so.singerId = si.singerId and songId = ?", [songId], utils.selectResultHandlerAndGenerateMusic(fn));
    utils.endConnection(conn);
}

exports.selectDetailBySongId = function (songId, fn) {
    var conn = utils.getConnection();
    conn.query("select so.songId,so.songName,so.songTime,so.lyric,so.playNum,a.albumId,a.albumName,so.singerId,s.singerName,a.resourceId from song so,singer s,album a where so.singerId = s.singerId and a.albumId = so.albumId and songId = ?", [songId], utils.selectResultHandlerAndGenerateImg(fn));
    utils.endConnection(conn);
}

exports.updatePlayNum = function (songId) {
    var conn = utils.getConnection();
    conn.query("update song set playNum = playNum + 1 where songId = ?", [songId]);
    utils.endConnection(conn);
}

exports.selectCountByKeyword = function (keyword, fn) {
    var conn = utils.getConnection();
    conn.query("select count(*) num from song where songName like ?", "%" + keyword + "%", utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectByKeyword = function (keyword, page, size, fn) {
    var conn = utils.getConnection();
    conn.query("select o.songId,o.songName,o.songTime,i.singerId,singerName from song o,singer i where o.singerId=i.singerId and songName like ? limit ?,?", ["%" + keyword + "%", (page - 1) * size, size], utils.selectResultHandler(fn));
    utils.endConnection(conn);
}