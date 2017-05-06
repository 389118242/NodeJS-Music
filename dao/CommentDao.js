/**
 * Created by Win on 2017/4/21.
 */
var utils = require('../utils');

exports.insert = function (type, id, comm, fn) {
    var conn = utils.getConnection();
    conn.query("insert into comment set ?", comm, utils.insertOrUpdateResultHandler(function (cid) {
        var conn = utils.getConnection();

        conn.query("insert into ?? values(?,?)", [type + "_com_relation", id, cid], utils.insertOrUpdateResultHandler(fn));
        utils.endConnection(conn);
    }));
    utils.endConnection(conn);
}

var getMapping = function () {
    return {
        song: ["song_com_relation", "songId"],
        album: ["alb_com_relation", "albId"],
        songList: ["sl_com_relation", "slId"]
    };
}

exports.select = function (type, id, begin, count, fn) {
    var conn = utils.getConnection();
    var param = getMapping()[type];
    param.push(id, begin, count);
    var sql = "select " +
        "sc.comId,sc.likeNum,sc.comContent,sc.userId,sc.userName,sc.userImg,pc.comId " +
        "p_comId,pc.likeNum p_likeNum,pc.comContent p_comContent,pc.userId " +
        "p_userId,pc.userName p_userName,pc.userImg p_userImg from (select " +
        "c.comId,c.comContent,c.likeNum,c.parentId,u.userId,u.userName,u.userImg from " +
        "comment c,user u where c.userId=u.userId) sc LEFT JOIN (select " +
        "c.comId,c.comContent,c.likeNum,u.userId,u.userName,u.userImg from comment c,user " +
        "u where c.userId=u.userId) pc on sc.parentId=pc.comId where sc.comId " +
        "in (select comId from ?? " +
        "where ?? = ?) order by " +
        "comId desc limit ?,?"
    conn.query(sql, param, utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectCommentCount = function (type, id, fn) {
    var conn = utils.getConnection();
    var param = getMapping()[type];
    param.push(id);
    conn.query("select count(*) num from ?? where ??= ?", param, utils.selectResultHandler(fn));
    utils.endConnection(conn);
}
