var express = require('express');
var router = express.Router();
var utils = require("../utils");
var userDao = require("../dao/UserDao");
var messageDao = require("../dao/MessageDao");
var songDao = require("../dao/SongDao");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect("/Music/index");
});
router.get('/index', function (req, res, next) {
    var ret = {title: '首页'};
    var callback = function () {
        res.render('index', ret);
    }
    var userId = req.session.userId;
    if (userId) {
        userDao.selectById(userId, function (users) {
            ret.user = users[0];
            utils.callback(ret, 3, callback);
        });
        messageDao.selectNoReadMessageByUserId(userId, function (result) {
            ret.noRead = result[0].noRead;
            utils.callback(ret, 3, callback);
        })
    } else {
        callback();
    }
});
router.get('/indexFrame', function (req, res, next) {
    var model = {};
    var callback = function () {
        if (Object.getOwnPropertyNames(model).length === 2) {
            model.title = "首页";
            res.render('indexFrame', model);
        }
    }
    songDao.selectRecommendSongs(1, function (result) {
        model.songList = result;
        callback();
    })
    songDao.selectSongsOfTop9(function (result) {
        model.sList = result;
        callback();
    })
});

module.exports = router;
