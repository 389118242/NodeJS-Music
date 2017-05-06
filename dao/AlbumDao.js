/**
 * Created by Win on 2017/4/21.
 */

var utils = require('../utils');

exports.selectSongsByAlbumId = function (albumId, fn) {
    var conn = utils.getConnection();
    conn.query("select songId,songName,songTime from song where albumId = ? ", albumId, utils.selectResultHandler(fn))
    utils.endConnection(conn);
}

exports.select = function (albumId, fn) {
    var conn = utils.getConnection();
    var qu = conn.query("select a.albumId,a.albumName,a.albumDetail,a.resourceId,s.singerId,s.singerName,companyName " +
        "from singer s,album a,record_company rc where s.singerId = a.singerId and a.issueCompany = rc.rcId and albumId = ? ", albumId, utils.selectResultHandlerAndGenerateImg(fn))
    console.log(qu.sql);
    utils.endConnection(conn);
}

exports.selectSongIdByAlbumId = function (albumId, fn) {
    var conn = utils.getConnection();
    conn.query("select songId from song where albumId = ? ", albumId, utils.selectResultHandler(fn))
    utils.endConnection(conn);
}

// exports.selectSongInfoByAlbumId = function (albumId, fn) {
//     var conn = utils.getConnection();
//     conn.query("select songId,songName,singerName,so.resourceId,lyric from song so,singer si where so.singerId = si.singerId and albumId = ?",albumId, utils.selectResultHandlerAndGenerateMusic(fn));
//     utils.endConnection(conn);
// }
exports.selectCountByKeyword = function (keyword, fn) {
    var conn = utils.getConnection();
    conn.query("select count(*) num from album where albumName like ?", "%" + keyword + "%", utils.selectResultHandler(fn))
    utils.endConnection(conn);
}

exports.selectByKeyword = function (keyword, page, size, fn) {
    var conn = utils.getConnection();
    conn.query("select a.albumId,a.albumName,a.resourceId,s.singerId,s.singerName from album a,singer s where a.singerId=s.singerId and albumName like ? limit ?,?", ["%" + keyword + "%", (page - 1) * size, size], utils.selectResultHandlerAndGenerateImg(fn));
    utils.endConnection(conn);
}