/**
 * Created by Win on 2017/3/3.
 */
var express = require("express");
var router = express.Router();
var utils = require("../utils");

router.get("/allList", function (req, res, next) {
    var conn = utils.getConnection();
    conn.query("select * from list_kind", function (err, result) {
        var kinds = [];
        if (!err)
            kinds = result
        res.render("allList", {title: "歌单", listKinds: kinds});
        utils.endConnection(conn);

    });
})

router.post("/getSongListByKind", function (req, resp) {
    var kindId = parseInt(req.body.kindId);
    var page = parseInt(req.body.page);
    if (isNaN(kindId) || isNaN(page)) {
        resp.json({});
        return;
    }
    var pageSize = 18;
    var model = {};
    var songListDao = require("../dao/SongListDao");
    var cb = function () {
        var ret = {};
        ret.songList = model.songLists;
        var total = model.total;
        var temp = total % pageSize == 0 ? total / pageSize : (total / pageSize + 1);
        temp = parseInt(temp);
        var totalPage = temp == 0 ? 1 : temp;
        var beginPage = page - 2 > 1 ? page - 2 : 1;
        var endPage = beginPage + 5 < totalPage ? beginPage + 5 : totalPage;
        beginPage = endPage - 5 > 1 ? endPage - 5 : 1;
        ret.bp = beginPage;
        ret.ep = endPage;
        ret.page = page;
        ret.totalPage = totalPage;
        resp.json(ret);
    }
    songListDao.selectByKindId(kindId, page, pageSize, function (songLists) {
        model.songLists = songLists;
        utils.callback(model, 2, cb);
    });
    songListDao.selectCountByKindId(kindId, function (result) {
        var total = 0;
        if (result[0] && result[0].num)
            total = result[0].num;
        model.total = total;
        utils.callback(model, 2, cb);
    });

})

module.exports = router;