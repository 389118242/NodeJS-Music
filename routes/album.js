/**
 * Created by Win on 2017/3/2.
 */
var express = require("express");
var router = express.Router();
var utils = require("../utils");
var albumDao = require("../dao/AlbumDao");

router.get("/album", function (req, res, next) {
    var albumId = parseInt(req.query.albumId);
    if (isNaN(albumId)) {
        utils.return404(next);
    }
    albumDao.select(albumId, function (result) {
        var album = result[0];
        if (album) {
            albumDao.selectSongsByAlbumId(albumId, function (songs) {
                var model = {};
                model.title = album.albumName;
                album.songs = songs;
                model.album = album;
                model.userId = req.session.userId;
                res.render("album", model);
            })
        } else
            utils.return404(next);
    })
});

router.post("/getAlbumSongId", function (req, res, next) {
    var albumId = parseInt(req.body.albumId);
    if (isNaN(albumId)) {
        res.json([]);
    }
    albumDao.selectSongIdByAlbumId(albumId, function (result) {
        var array = [];
        for (var i in result)
            array.push(result[i].songId);
        res.json(array);
    });
});

module.exports = router;