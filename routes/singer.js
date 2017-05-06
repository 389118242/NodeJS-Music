/**
 * Created by Win on 2017/4/22.
 */
var express = require("express");
var router = express.Router();
var utils = require("../utils");
var singerDao = require("../dao/SingerDao");

router.get("/singer", function (req, resp, next) {
    var singerId = parseInt(req.query.singerId);
    if (isNaN(singerId)) {
        utils.return404(next);
        return;
    }

    singerDao.select(singerId, function (result) {
        var singer = result[0];
        if (singer) {
            singerDao.selectSongsTop50BySingerId(singerId, function (songs) {
                resp.render("singerDetail", {title: singer.singerName, singer: singer, songTop50: songs});
            })
        } else
            utils.return404(next);
    })
});

router.post("/getAlbumsOfSinger", function (req, resp, next) {
    var singerId = parseInt(req.body.singerId);
    var page = parseInt(req.body.page);
    var pageSize = 9;
    var model = {};

    var cb = function () {
        var total = model.total;
        var temp = parseInt(total / pageSize);
        var totalPage = total % pageSize == 0 ? temp : temp + 1;
        var beginPage = page - 2 > 1 ? page - 2 : 1;
        var endPage = beginPage + 4 < totalPage ? beginPage + 4 : totalPage;
        beginPage = endPage - 4 > 1 ? endPage - 4 : 1;
        var ret = {};
        ret.bp = beginPage;
        ret.ep = endPage;
        ret.present = page;
        ret.totalPage = totalPage;
        ret.albums = model.albums;
        resp.json(ret);
    }

    singerDao.selectAlbumCount(singerId, function (result) {
        model.total = result[0].num;
        utils.callback(model, 2, cb);
    });
    singerDao.selectAlbums(singerId, page, pageSize, function (result) {
        var dateFormat = require("../utils/DateFormat");
        for (var i in result) {
            var album = result[i];
            album.issueTime = dateFormat.toDate(album.issueTime);
        }
        model.albums = result;
        utils.callback(model, 2, cb);
    })
});

module.exports = router;