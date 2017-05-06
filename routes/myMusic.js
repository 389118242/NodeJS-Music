/**
 * Created by Win on 2017/3/6.
 */
var express = require("express");
var router = express.Router();
var utils = require('../utils');
var songListDao = require("../dao/SongListDao");

var dateFormat = require('../utils/DateFormat');

router.get("/myMusic", function (req, res, next) {
    var userId = req.session.userId;
    if (!userId) {
        utils.return404(next);
        return;
    }
    songListDao.selectCreated(userId, function (songLists) {
        var ret = {title: 'My Music', dateFormat: dateFormat};
        var defaultList = songLists[0];
        ret.songListList = songLists;
        if (defaultList) {
            var listId = defaultList.listId;
            songListDao.selectSongsBySongListId(listId, function (songs) {
                ret.songs = songs;
                res.render("myMusic", ret);
            })
        } else {
            ret.songs = [];
            res.json(ret);
            res.render("myMusic", ret);
        }
    })
});

router.post("/showSongs", function (req, resp) {
    var listId = parseInt(req.body.songListId);
    if (isNaN(listId))
        resp.json([]);
    else {
        songListDao.selectSongsBySongListId(listId, function (songs) {
            resp.json(songs);
        })
    }
});

router.post("/deleteSongList", function (req, resp) {
    var songListId = parseInt(req.body.songListId);
    if (isNaN(songListId)) {
        resp.status(501);
    } else {
        delete_sl_song_relation(songListId, resp);
    }
});

var delete_sl_song_relation = function (songListId, resp) {
    var conn = utils.getConnection();
    conn.query("delete from sl_song_relation where slId = ?", songListId, utils.deleteResultHandler(function (success) {
        if (success) {
            delete_sl_com_relation(songListId, resp);
        } else {
            resp.status(501);
        }
    }));
    utils.endConnection(conn);
}

var delete_sl_com_relation = function (songListId, resp) {
    var conn = utils.getConnection();
    conn.query("delete from sl_com_relation where slId = ?", songListId, utils.deleteResultHandler(function (success) {
        if (success)
            delete_comment(songListId, resp);
        else
            resp.status(501);
    }));
    utils.endConnection(conn);
}

var delete_comment = function (songListId, resp) {
    var conn = utils.getConnection();
    conn.query("delete from comment where comId in (select comId from sl_com_relation where slId = ?)", songListId, utils.deleteResultHandler(function (success) {
        if (success)
            delete_sl_lk_relation(songListId, resp);
        else
            resp.status(501);
    }));
    utils.endConnection(conn);
}

var delete_sl_lk_relation = function (songListId, resp) {
    var conn = utils.getConnection();
    conn.query("delete from sl_lk_relation where slId = ?", songListId, utils.deleteResultHandler(function (success) {
        if (success)
            delete_collection(songListId, resp);
        else
            resp.status(501);
    }));
    utils.endConnection(conn);
}

var delete_collection = function (songListId, resp) {
    var conn = utils.getConnection();
    conn.query("delete from collection where listId = ?", songListId, utils.deleteResultHandler(function (success) {
        if (success)
            delete_song_list(songListId, resp);
        else
            resp.status(501);
    }));
    utils.endConnection(conn);
}

var delete_song_list = function (songListId, resp) {
    var conn = utils.getConnection();
    conn.query("delete from song_list where listId = ?", songListId, utils.deleteResultHandler(function (success) {
        if (success)
            resp.status(200).send("SUCCESS");
        else
            resp.status(501);
    }));
    utils.endConnection(conn);
}

router.post("/deleteSongFromList", function (req, resp) {
    var songId = parseInt(req.body.songId);
    var songListId = parseInt(req.body.songListId);
    if (isNaN(songId) || isNaN(songListId)) {
        resp.status(501);
    } else {
        var conn = utils.getConnection();
        conn.query("delete from sl_song_relation where slId = ? and songId = ?", [songListId, songId], utils.deleteResultHandler(function (success) {
            if (success) {
                resp.status(200);
            } else {
                resp.status(501);
            }
        }));
        utils.endConnection(conn);
    }
});

module.exports = router;