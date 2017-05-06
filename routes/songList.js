/**
 * Created by Win on 2017/4/22.
 */
var express = require("express");
var router = express.Router();
var utils = require("../utils");
var songListDao = require("../dao/SongListDao");

router.post("/getSongList", function (req, resp, next) {
    var userId = req.session.userId;
    if (userId == null) {
        resp.json([]);
        return;
    }
    songListDao.selectWithSongNumByUserId(userId, function (songLists) {
        resp.json(songLists);
    })
});

router.post("/addSongTosongList", function (req, resp, next) {
    var userId = req.session.userId;
    if (userId == null) {
        resp.send("0");
        return;
    }
    var songList = {};
    songList.listName = req.body.listName;
    var songId = req.body.songId;
    songList.userId = userId;
    songListDao.insert(songList, function (slId) {
        if (slId) {
            songListDao.insertSongAndSLRelation(slId, songId, function (affectedRows) {
                if (affectedRows)
                    resp.send("1");
                else
                    resp.send("-2");
            })
        } else
            resp.send("-1");
    })
});

router.post("/collectSong", function (req, resp, next) {
    var userId = req.session.userId;
    if (userId == null) {
        resp.send("0");
        return;
    }
    var slId = req.body.collectListId;
    var songId = req.body.songId;
    songListDao.insertSongAndSLRelation(slId, songId, function (affectedRows) {
        if (affectedRows) {
            resp.send("1");

        } else
            resp.send("-1");
    })
});
/**  TODO 待改进
 var tryUpdateChangeListImg = function (listId, songId) {
    var conn = utils.getConnection();
    conn.query("select listImg from song_list where listId = ?", listId, utils.selectResultHandler(function (result) {
        if (result[0] && result[0].listImg) {
            if (result[0].listImg.indexOf("slImg/") === -1) {
                var conn = utils.getConnection();
                conn.query("select a.resourceId from album a,song s where a.albumId = s.albumId and s.songId = ?", songId, utils.selectResultHandlerAndGenerateImg(function (result) {
                    if (result[0] && result[0].img) {
                        var img = result[0].img;
                        var conn = utils.getConnection();
                        conn.query("update song_list set listImg = ? where listId = ?", [img.substring(1), listId]);
                        utils.endConnection(conn);
                    }
                }))
                utils.endConnection(conn);
            }
        }
    }));
    utils.endConnection(conn);
}
 */
router.get("/songListDetail", function (req, resp, next) {
    var songListId = parseInt(req.query.songListId);
    if (isNaN(songListId)) {
        utils.return404(next);
        return;
    }
    songListDao.selectBySongListId(songListId, function (result) {
        var songList = result[0];
        if (songList) {
            var model = {};
            var attrNum = 2;
            var userId = req.session.userId;

            var cb = function () {
                var ret = {};
                ret.title = songList.listName;
                ret.userId = userId;
                songList.songList = model.songs;
                ret.songList = songList;
                ret.listKind = model.kinds;
                ret.collection = model.collection;
                resp.render("songList", ret);
            }
            if (userId && userId !== songList.userId) {
                attrNum += 1;
                var conn = utils.getConnection();
                conn.query("select count(*) num from collection where userId = ? and listId = ?", [userId, songListId], utils.selectResultHandler(function (result) {
                    var collection = false;
                    if (result[0] && result[0].num)
                        collection = true;
                    model.collection = collection;
                    utils.callback(model, attrNum, cb);
                }))
                utils.endConnection(conn);
            }
            songListDao.selectKindBySongListId(songListId, function (kinds) {
                model.kinds = kinds;
                utils.callback(model, attrNum, cb);
            });
            songListDao.selectSongsBySongListId(songListId, function (songs) {
                model.songs = songs;
                utils.callback(model, attrNum, cb);
            })
        } else
            utils.return404(next);
    });
});

router.post("/getSongListSongId", function (req, resp) {
    var songListId = parseInt(req.body.listId);
    if (isNaN(songListId)) {
        resp.json([]);
        return;
    }
    songListDao.selectSongIdBySongListId(songListId, function (result) {
        var ret = [];
        for (var i in result)
            ret.push(result[i].songId);
        if (ret.length !== 0)
            songListDao.updatePlayNum(songListId);
        resp.json(ret);
    })
});

router.post("/collectionSongList", function (req, resp) {
    var userId = parseInt(req.body.userId);
    var slId = parseInt(req.body.slId);
    if (!isNaN(userId) && !isNaN(slId)) {
        var conn = utils.getConnection();
        conn.query("insert into collection set ?", {
            userId: userId,
            listId: slId
        }, utils.insertOrUpdateResultHandler(function (affectRows) {
            if (affectRows) {
                resp.send(true);
                collectionNumAdd(slId, 1);
            } else
                resp.send(false);
        }))
        utils.endConnection(conn);
    }
});

router.post("/cancelCollection", function (req, resp) {
    var userId = parseInt(req.body.userId);
    var slId = parseInt(req.body.slId);
    if (!isNaN(userId) && !isNaN(slId)) {
        var conn = utils.getConnection();
        conn.query("delete from collection where listId = ? and userId = ?", [slId, userId], utils.deleteResultHandler(function (success) {
            if (success) {
                resp.send(true);
                collectionNumAdd(slId, -1);
            } else
                resp.send(false);
        }));
        utils.endConnection(conn);
    }
});

var collectionNumAdd = function (listId, num) {
    var conn = utils.getConnection();
    conn.query("update song_list set collectionNum = collectionNum + ? where listId = ?", [num, listId]);
    utils.endConnection(conn);
}

module.exports = router;