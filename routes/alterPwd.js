/**
 * Created by Win on 2017/3/1.
 */
var express = require('express');
var router = express.Router();
var utils = require("../utils");
var userDao = require("../dao/UserDao");

router.get("/alterPassword", function (req, res, next) {
    var userId = req.session.userId;
    if (userId) {
        var conn = utils.getConnection();
        conn.query("select userAccount from user where userId = ?", userId, utils.selectResultHandler(function (result) {
            if (result[0]) {
                res.render("alterPassword", {title: "修改密码", user: {userAccount: result[0].userAccount}});
            } else
                utils.return404(next);
        }))
        utils.endConnection(conn);
    } else
        utils.return404(next);
});

router.post("/alterPassword", function (req, resp) {
    var userId = req.session.userId;
    if (userId) {
        var o_pass = req.body.oldPassword;
        var n_pass = req.body.newPassword;
        var conn = utils.getConnection();
        conn.query("select userAccount from user where userId = ? and userPassword = ?", [userId,utils.afterMD5(o_pass)], utils.selectResultHandler(function (result) {
            if (result[0]) {
                var conn = utils.getConnection();
                conn.query("update user set userPassword = ? where userId = ?",[utils.afterMD5(n_pass),userId],utils.insertOrUpdateResultHandler(function (affectRows) {
                    if(affectRows){
                        req.session.userId = undefined;
                        resp.send("s");
                    }else{
                        resp.send("e");
                    }
                }));
                utils.endConnection(conn);
            } else
                resp.send("f");
        }))
        utils.endConnection(conn);
    } else {
        resp.send("n");
    }

})

module.exports = router;