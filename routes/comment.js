/**
 * Created by Win on 2017/4/21.
 */
var express = require("express");
var router = express.Router();
var commentDao = require("../dao/CommentDao");
var utils = require("../utils");

router.post("/addComment", function (req, resp, next) {
    var param = req.body;
    var userId = req.session.userId;
    if (userId == null) {
        resp.send("-1");
        return;
    }
    // TODO 冻结账号判断
    var type = param.type;
    var id = param.id;
    var comContent = param.comContent;
    var pId = param.parentId;
    var comm = {userId: userId, comContent: comContent};
    if (pId)
        comm.parentId = pId;
    var t_map = {song: "song", album: "alb", songList: "sl"};
    var mapper = t_map[type];
    commentDao.insert(mapper, id, comm, function (er) {
        resp.send(er + "");
        if (type === "songList") {
            sendCommentMess(id, comContent, userId);
        }
        if (pId) {
            sendReplyMess(type, id, pId, comContent, userId);
        }
    })
});

var sendCommentMess = function (listId, content, userId) {
    var conn = utils.getConnection();
    conn.query("select listName,userId from song_list where listId = ?", listId, utils.selectResultHandler(function (result) {
        var songList = result[0];
        if (songList) {
            if (userId !== songList.userId) {
                addMessae("COMMENT", userId, songList.userId, content +
                    "<br/>我的歌单：<a href='songListDetail?songListId=" + listId + "'>"
                    + songList.listName + "</a>");
            }
        }
    }));
    utils.endConnection(conn);
}

var sendReplyMess = function (type, id, pId, content, userId) {
    var t_map = {song: ["song", "songId"], album: ["album", "albumId"], songList: ["songListDetail", "songListId"]};
    var conn = utils.getConnection();
    conn.query("select userId,comContent from comment where comId = ?", pId, utils.selectResultHandler(function (result) {
        var comment = result[0];
        if (comment && comment.userId !== userId) {
            var mapping = t_map[type];
            addMessae("REPLY", userId, comment.userId, content + "<br/>回复我的评论：<a href='" + mapping[0] + "?" + mapping[1] + "=" + id + "'>"
                + comment.comContent + "</a>")
        }
    }));
    utils.endConnection(conn);
}

var addMessae = function (type, sid, rid, content) {
    var conn = utils.getConnection();
    conn.query("insert into message set ?", {
        sendUserId: sid,
        messType: type,
        receiveUserId: rid,
        messContent: content
    });
    utils.endConnection(conn);
}

router.post("/getComment", function (req, resp, next) {
    var type = req.body.type;
    var id = req.body.id;
    var page = req.body.page;
    var pageSize = 9;
    var model = {};
    var cb = function () {
        var total = model.count;
        var temp = parseInt(total / pageSize);
        var totalPage = total % pageSize == 0 ? temp : temp + 1;
        var beginPage = page - 2 > 1 ? page - 2 : 1;
        var endPage = beginPage + 5 > totalPage ? totalPage : beginPage + 5;
        beginPage = endPage - 5 > 1 ? endPage - 5 : 1;
        var json = {};
        json.comList = model.comms;
        json.bp = beginPage;
        json.ep = endPage;
        json.page = page;
        json.tp = totalPage;
        resp.json(json);
    }
    commentDao.select(type, id, (page - 1) * pageSize, pageSize, function (result) {
        model.comms = result;
        utils.callback(model, 2, cb);
    });
    commentDao.selectCommentCount(type, id, function (result) {
        var count = result[0].num;
        model.count = count;
        utils.callback(model, 2, cb);
    })
});

module.exports = router;