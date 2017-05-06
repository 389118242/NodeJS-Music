/**
 * Created by Win on 2017/4/22.
 */
var utils = require('../utils');

exports.select = function (singerId, fn) {
    var conn = utils.getConnection();
    conn.query("select singerId,singerName,resourceId,singerDetail from singer where singerId = ?", singerId, utils.selectResultHandlerAndGenerateImg(fn));
    utils.endConnection(conn);
}

exports.selectSongsTop50BySingerId = function (singerId, fn) {
    var conn = utils.getConnection();
    conn.query("select songId,songName,songTime,s.albumId,albumName from song s,album a where s.albumId = a.albumId and s.singerId = ? order by playNum desc limit 0,9", singerId, utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectAlbumCount = function (singerId, fn) {
    var conn = utils.getConnection();
    conn.query("select count(*) num from album where singerId= ?", singerId, utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectAlbums = function (singerId, page, size, fn) {
    var conn = utils.getConnection();
    conn.query("select albumId,albumName,issueTime,resourceId from album where singerId= ? limit ?,?", [singerId, (page - 1) * size, size], utils.selectResultHandlerAndGenerateImg(fn));
    utils.endConnection(conn);
}

exports.selectCountByKeyword = function (keyword, fn) {
    var conn = utils.getConnection();
    conn.query("select count(*) num from singer where singerName like ?", "%" + keyword + "%", utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectByKeyword = function (keyword, page, size, fn) {
    var conn = utils.getConnection();
    conn.query("select singerId,singerName,resourceId from singer where singerName like ? limit ?,?", ["%" + keyword + "%", (page - 1) * size, size], utils.selectResultHandlerAndGenerateImg(fn));
    utils.endConnection(conn);
}