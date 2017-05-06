/**
 * Created by Win on 2017/4/21.
 */

var express = require("express");
var router = express.Router();
var utils = require("../utils");
var songDao = require("../dao/SongDao");

router.post("/getSongInfo", function (req, resp, next) {
    var id = req.body.songId;
    id = parseInt(id);
    if (isNaN(id)) {
        resp.json({});
        return;
    }
    songDao.selectBySongId(id, function (result) {
        result = result[0];
        if (result) {
            var songInfo = {};
            songInfo.songId = result.songId;
            songInfo.title = result.songName;
            songInfo.artist = result.singerName;
            songInfo.mp3 = result.music;
            songInfo.poster = "";
            songInfo.lyric = result.lyric;
            resp.json(songInfo);
        } else {
            resp.json({});
        }
    })
});


router.get("/song", function (req, resp, next) {
    var songId = parseInt(req.query.songId);
    if (isNaN(songId)) {
        utils.return404(next);
    } else {
        songDao.selectDetailBySongId(songId, function (song) {
            song = song[0];
            if (song) {
                var lyric = song.lyric;
                var lyrs = [];
                if(lyric)
                    lyrs= lyric.split(/\[\d+\:(?:\d+)(?:\.\d+)?\]/gi);
                delete song.lyric;
                var userId = req.session.userId;
                resp.render("songDetail", {title: song.songName, song: song, userId: userId, lyrs: lyrs});
            } else {
                utils.return404(next);
            }
        });
    }
});

router.get("/download/:songId", function (req, resp, next) {
    var songId = parseInt(req.params.songId);
    if (isNaN(songId)) {
        utils.return404(next);
        return;
    }
    /**
     var conn = utils.getConnection();
     var sql = "select songName,singerName,data,extension from song so,singer si,resource r where so.singerId = si.singerId and so.resourceId = r.id and songId = ?";
     conn.query(sql,songId, function (err, result) {
        var song = result[0];
        if(song){
            resp.set({
                "Content-type":"application/octet-stream",
                "Content-Disposition":"attachment;filename="+encodeURI(song.singerName+'-'+song.songName+'.'+song.extension)
            });
            resp.send(song.data);
        }else
            utils.return404(next);
    });
     utils.endConnection(conn);
     */
    songDao.selectBySongId(songId, function (result) {
        var song = result[0];
        if (song) {
            var fileName_p = song.singerName + '-' + song.songName;
            var fileName_s = song.music.substring(song.music.lastIndexOf("\."));
            var filaName = fileName_p + fileName_s;
            var filePath = __dirname + '/../public' + song.music;
            resp.download(filePath, filaName);
        } else
            utils.return404(next);
    })
});

router.post("/addSongPlayNum", function (req,resp) {
    var songId = parseInt(req.body.songId);
    if (!isNaN(songId)) {
        songDao.updatePlayNum(songId);
        resp.status(200);
    }
})

module.exports = router;