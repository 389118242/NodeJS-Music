/**
 * Created by Win on 2017/3/2.
 */
var express = require('express');
var router = express.Router();
var utils = require("../utils");
var songListDao = require("../dao/SongListDao");

router.get("/editSongList", function (req, res, next) {
    var songListId = parseInt(req.query.songListId);
    var userId = req.session.userId;
    if (isNaN(songListId) || !userId) {
        utils.return404(next);
        return;
    }
    var model = {};
    var cb = function () {
        model.title = "修改歌单";
        model.param = {songListId: songListId};
        res.render("editSongList", model);
    }
    songListDao.selectBySongListId(songListId, function (result) {
        if (!result[0] || result[0].userId != userId || result[0].listName === "我喜欢的音乐") {
            utils.return404(next);
            return;
        }
        model.songList = result[0] ? result[0] : {};

        songListDao.selectKindByListId(songListId, function (result) {
            model.listKind = result;
            utils.callback(model, 3, cb);
        })

        var conn = utils.getConnection();
        conn.query("SELECT s.listId,s.listName,s.listImg,COUNT(ssr.songId) num " +
            "FROM song_list s LEFT JOIN sl_song_relation ssr ON s.listId = ssr.slId " +
            "WHERE s.userId = ? GROUP BY s.listId,s.listName,s.listImg ORDER BY listId", userId, function (err, result) {
            if (err)
                result = [];
            model.songListList = result;
            utils.callback(model, 3, cb);
        })
        utils.endConnection(conn);


    });

});

router.post("/showSongList", function (req, res) {
    var listId = parseInt(req.body.listId);
    if (isNaN(listId))
        res.json({});
    else {
        var model = {};
        var cb = function () {
            var songList = model.songList;
            songList.kinds = model.kinds;
            res.json(songList);
        }
        songListDao.selectBySongListId(listId, function (result) {
            model.songList = result[0] ? result[0] : {};
            utils.callback(model, 2, cb);
        });
        songListDao.selectKindByListId(listId, function (kinds) {
            model.kinds = kinds;
            utils.callback(model, 2, cb);
        })
    }
})

router.post("/getListKind", function (req, res, next) {
    var conn = utils.getConnection();
    conn.query("select * from list_kind", function (err, result) {
        res.json(result);
        utils.endConnection(conn);
    });
});

var multiparty = require("multiparty");
var fs = require("fs");
var tmpData = {};

router.post("/uploadListImg", function (req, resp) {
    var dir = 'public/img-tmp/';
    var form = new multiparty.Form({uploadDir: dir});
    form.parse(req, function (err, fields, files) {
        var listId = fields.songListId[0];
        if (err)
            resp.send("");
        else {
            var tmp = files.file[0];
            var fileName = listId + '_' + tmp.originalFilename;
            if (tmpData[listId])
                fs.unlinkSync(tmpData[listId]);
            tmpData[listId] = dir + fileName;
            fs.renameSync(tmp.path, dir + fileName);
            resp.send("/img-tmp/" + fileName);
        }
    })
});

var images = require("images");
var async = require("async");
router.post("/editList", function (req, resp) {
    var param = req.body;
    var songList = {};
    var listId = songList.listId = parseInt(param.listId);
    if (!isNaN(songList.listId)) {
        songList.listName = param.listName;
        songList.listDetail = param.listDetail;
        var imgData = param.imgData;
        var imgPath;
        if (imgData !== null) {
            var x = imgData.x;
            var y = imgData.y;
            var width = imgData.width;
            var height = imgData.height;
            var sourcePath = "public" + param.imgPath;
            var targetPath = "public/slImg/" + listId + ".jpg";
            var img = images(sourcePath);
            images(img, x, y, width, height).save(targetPath);
            fs.unlinkSync(sourcePath);
            delete tmpData[listId + ''];
            imgPath = "slImg/" + listId + ".jpg";
        }
        var task = [];
        task.push(updateSongListFN(songList, imgPath));
        task.push(deleteSL_LK_RA_FN(listId));
        for (var i in param.listKind) {
            var kindId = parseInt(param.listKind[i]);
            if (!isNaN(kindId))
                task.push(updateSL_LK_RA_FN(listId, kindId));
        }
        async.series(task, function (err, result) {
            var ret = result.indexOf(0) === -1 ? "s" : "f";
            resp.send(ret);
        })
    }

});

var updateSongListFN = function (songList, imgPath) {
    return function (cb) {
        var conn = utils.getConnection();
        var param = [songList.listName, songList.listDetail];
        if (imgPath)
            param.push(imgPath);
        param.push(songList.listId);
        var sql = "update song_list set listName = ?,listDetail = ?" + (imgPath ? ",listImg = ?" : "") + " where listId = ?";
        conn.query(sql, param, utils.insertOrUpdateResultHandler(function (affectRows) {
            if (affectRows)
                cb(null, 1);
        }));
        utils.endConnection(conn);
    }
};
var deleteSL_LK_RA_FN = function (listId) {
    return function (cb) {
        var conn = utils.getConnection();
        conn.query("delete from sl_lk_relation where slId = ?", listId, utils.deleteResultHandler(function (affectRows) {
            if (affectRows)
                cb(null, 1);
        }));
        utils.endConnection(conn);
    }
}
var updateSL_LK_RA_FN = function (listId, kindId) {
    return function (cb) {
        var conn = utils.getConnection();
        conn.query("insert into sl_lk_relation set ?", {
            slId: listId,
            lkId: kindId
        }, utils.insertOrUpdateResultHandler(function (affectRows) {
            if (affectRows)
                cb(null, 1);
        }));
        utils.endConnection(conn);
    }
}

router.post("/addNewList", function (req, resp) {
    var userId = req.session.userId;
    if (!userId)
        resp.send("f");
    else {
        var listName = req.body.listName;
        var songList = {userId: userId, listName: listName};
        songListDao.insert(songList, function (id) {
            if (id) {
                resp.send("s");
            } else {
                resp.send("f");
            }
        })
    }
})

module.exports = router;