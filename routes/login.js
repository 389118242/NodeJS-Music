/**
 * Created by Win on 2017/3/3.
 */
var express = require('express');
var router = express.Router();
var userDao = require('../dao/UserDao');
var utils = require('../utils');

router.get("/login", function (req, res, next) {
    res.render("login", {title: "登录"});
});

router.post("/login", function (req, res, next) {
    var account = req.body.userAccount;
    var password = req.body.userPassword;
    var isAutoLogin = req.body.isAutoLogin;
    userDao.selectByAccountAndPassword(account, password, function (ret) {
        if (ret[0]) {
            var user = ret[0];
            if (user.userState === 0) {
                res.send("ENABLE");
                return;
            }
            req.session.userId = user.userId;
            if (isAutoLogin == 'true') {
                res.cookie('musicLogin', account + ':' + utils.afterMD5(password));
            } else {
                res.cookie('musicLogin', undefined, {maxAge: 0});
            }
            res.send("SUCCESS");
        } else {
            res.send("FAILED");
        }
    })
});

// TODO 用退出后前端页面菜单展开按钮异常
router.get("/userLogout", function (req, resp) {
    req.session.userId = undefined;
    resp.clearCookie('musicLogin');
    resp.redirect("/Music");
})

module.exports = router;