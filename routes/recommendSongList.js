/**
 * Created by Win on 2017/4/23.
 */
var express = require("express");
var router = express.Router();
var utils = require("../utils");

router.get("/recommend", function (req, resp, next) {
    var conn = utils.getConnection();
    conn.query("select img,listId,listName,listDetail from recommend_song_list rsl,song_list sl where rsl.slId = sl.listId order by rsl.index", function (err, result) {
        if (err) {
            var err = new Error(err);
            err.status = 500;
            next(err);
        } else {
            resp.render("recommendSongList", {title: "推荐歌单", "rsl": result});
        }
    });
    utils.endConnection(conn);
})

module.exports = router;