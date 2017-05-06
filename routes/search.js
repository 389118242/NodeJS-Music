/**
 * Created by Win on 2017/3/10.
 */
var express = require("express");
var router = express.Router();
var utils = require("../utils");

var songDao = require("../dao/SongDao");
var singerDao = require("../dao/SingerDao");
var albumDao = require("../dao/AlbumDao");
var songListDao = require("../dao/SongListDao");

router.get("/search", function (req, res, next) {
    var key = req.query.key;//不推荐使用req.param("key");
    //Mar 2017 12:28:44 GMT express deprecated req.param(name): Use req.params, req.body, or req.query instead at routes\search.js:8:19
    if (!key)
        key = '';
    res.render("search", {title: "搜索", key: key});
});


var searchSong = function () {

}

router.post("/search", function (req, resp) {
    var type = req.body.type;
    var keyword = req.body.key;
    var page = parseInt(req.body.page);
    if (isNaN(page))
        page = 1;
    var model = {};
    var cb = function () {
        var ret = {};
        var total = model.total;
        var totalPage = total % pageSize == 0 ? total / pageSize : total / pageSize + 1;
        totalPage = parseInt(totalPage);
        var beginPage = page - 2 > 1 ? page - 2 : 1;
        var endPage = beginPage + 5 < totalPage ? beginPage + 5 : totalPage;
        beginPage = endPage - 5 > 1 ? endPage - 5 : 1;
        ret.bp = beginPage;
        ret.ep = endPage;
        ret.page = page;
        ret.totalPage = totalPage;
        ret.resultList = model.data;
        resp.json(ret);
    }
    var data = function (result) {
        model.data = result;
        utils.callback(model, 2, cb);
    }
    var totalCount = function (result) {
        var total = 0;
        if (result[0] && result[0].num)
            total = result[0].num;
        model.total = total;
        utils.callback(model, 2, cb);
    }

    var pageSize = 9;
    if (type === "song") {
        songDao.selectByKeyword(keyword, page, pageSize, data);
        songDao.selectCountByKeyword(keyword, totalCount);
    } else if (type === "singer") {
        singerDao.selectByKeyword(keyword, page, pageSize, data);
        singerDao.selectCountByKeyword(keyword, totalCount);
    } else if (type === "album") {
        albumDao.selectByKeyword(keyword, page, pageSize, data);
        albumDao.selectCountByKeyword(keyword, totalCount);
    } else if (type === "songList") {
        songListDao.selectByKeyword(keyword, page, pageSize, data);
        songListDao.selectCountByKeyword(keyword, totalCount);
    } else {
        resp.json({});
    }

});

module.exports = router;