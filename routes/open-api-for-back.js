/**
 * Created by Win on 2017/4/21.
 */
var express = require("express");
var router = express.Router();
var utils = require("../utils");
var fileCacheUtil = require("../utils/FileCacheUtil");
// TODO 对后台开放接口支持对 歌单图片的操作 和对 推荐歌单图片的操作
router.post("/reload", function (req, resp) {
    var type = req.body.type;
    var id = req.body.id;
    fileCacheUtil.reload(type, id);
    resp.send("SUCCESS");
});

var multiparty = require("multiparty");
var images = require("images");
var fs = require("fs");
var detail_map = {"L": {"W": 400, "H": 400}, "M": {"W": 200, "H": 400}, "S": {"W": 256, "H": 256}};
router.post("/alterRecommendSongList", function (req, resp) {
    var form = new multiparty.Form({uploadDir: "public/img-tmp"});
    form.parse(req, function (err, fields, files) {
        var index = fields.index[0];
        index = parseInt(index);
        var listId = fields.listId[0];
        listId = parseInt(listId);
        var detail = fields.detail[0];
        if (err)
            resp.send("Form parse error");
        else {
            var tmp = files.img[0];
            var sql = "update recommend_song_list rsl set slId = ?";
            var param = [listId];
            if (tmp) {
                var fileName = 'rc_' + index + '.jpg';
                var widthAndHeight = detail_map[detail];
                images(tmp.path).resize(widthAndHeight.W, widthAndHeight.H).save("public/rcImg/" + fileName);
                fs.unlinkSync(tmp.path);
                sql += ",img = ?";
                param.push("/rcImg/" + fileName);
            }
            param.push(index);
            var conn = utils.getConnection();
            conn.query(sql + " where rsl.index = ?", param, utils.insertOrUpdateResultHandler(function (affectRows) {
                if (affectRows)
                    resp.send("SUCCESS");
                else
                    resp.send("FAILED");
            }))
            utils.endConnection(conn);
        }
    })
});

module.exports = router;