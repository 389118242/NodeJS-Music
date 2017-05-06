/**
 * Created by Win on 2017/3/3.
 */
var express = require('express');
var router = express.Router();
var userDao = require('../dao/UserDao');
var songListDao = require('../dao/SongListDao');

router.get("/register", function (req, res, next) {
    res.render("register", {title: "注册"});
});

router.post("/register", function (req, res, next) {
    /**
     * userAccount
     * userName
     * userPassword
     * userEmail
     */
    var user = {};
    user.userAccount = req.body.userAccount;
    user.userName = req.body.userName;
    user.userPassword = req.body.userPassword;
    user.userEmail = req.body.userEmail;
    user.userBirthDay = '1999-09-09';
    user.userImg = '/images/user_default.png';
    userDao.insert(user, function (id) {
        if (id !== 0) {
            var songList = {};
            songList.listName = "我喜欢的音乐";
            songList.userId = id;
            songList.listImg = "slImg/MyFavorite.jpg";
            //TODO 添加歌单图片 songList.listImg
            songListDao.insert(songList, function (id) {
                if (id !== 0)
                    console.info("用户：" + user.userName + " 的默认歌单（\"我喜欢的音乐\")创建成功；歌单 id：" + id);
            })
            res.render("successRegister", {title: "注册成功"});
        }
    })
});

router.post("/accountIsExists", function (req, res, next) {
    var account = req.body.userAccount;
    userDao.selectByAccount(account, function (result) {
        var ret = true;
        if (result[0]) {
            ret = false;
        }
        res.json({ret: ret});
    })
});

module.exports = router;