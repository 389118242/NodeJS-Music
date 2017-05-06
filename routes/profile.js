/**
 * Created by Win on 2017/3/6.
 */
var express = require("express");
var router = express.Router();
var utils = require("../utils");
var messageDao = require("../dao/MessageDao");
var addressDao = require('../dao/AddressDao');
var songListDao = require("../dao/SongListDao");

var callback = function (model, num, fn) {
    if (Object.getOwnPropertyNames(model).length == num) {
        fn();
    }
}

router.get("/profile", function (req, res, next) {
    var userId = req.query.userId;
    if (!userId) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;
    }
    var loginId = req.session.userId;
    var isSelf = (userId + '') === (loginId + '');
    var conn = utils.getConnection();

    conn.query("select userName,userImg,userAddress from user where userId = ?", [userId], function (err, user) {
        user = user[0];
        if (user) {
            var model = {};
            model.user = user;
            model.isSelf = isSelf;
            var finalCallback = function () {
                model.title = "个人信息";
                res.render('profile', model);
            }
            var attrCount = 4;
            var addressId = user.userAddress;
            if (addressId) {
                addressDao.select(addressId, function (result) {
                    var address = result[0];
                    var pro = {};
                    var city = {};
                    var dis = {};
                    pro.addressId = address.proId;
                    pro.addressName = address.proName;
                    city.addressId = address.cityId;
                    city.addressName = address.cityName;
                    dis.addressId = address.disId;
                    dis.addressName = address.disName;
                    user.province = pro;
                    user.city = city;
                    user.district = dis;
                    getOtherData(userId, model, attrCount, finalCallback);
                });
            } else {
                getOtherData(userId, model, attrCount, finalCallback);
            }
            callback(model, attrCount, finalCallback);
        }
    });
    utils.endConnection(conn);
});

var getOtherData = function (userId, model, attrCount, finalCallback) {
    if (model.isSelf) {
        attrCount += 6;
        var getNoReadCount = function (messages) {
            var i = 0;
            for (; i < messages.length; i++) {
                var message = messages[i];
                if (message.isRead === 1)
                    break;
            }
            return i;
        }
        messageDao.selectMessageByUserIdAndMessageType(userId, 'COMMENT', function (result) {
            model.messagesList = result;
            model.messageNew = getNoReadCount(result);
            callback(model, attrCount, finalCallback);
        });
        messageDao.selectMessageByUserIdAndMessageType(userId, 'REPLY', function (result) {
            model.likesList = result;
            model.likesNew = getNoReadCount(result);
            callback(model, attrCount, finalCallback);
        });
        messageDao.selectMessageByUserIdAndMessageType(userId, 'PRIVATE', function (result) {
            model.letterList = result;
            model.lettersNew = getNoReadCount(result);
            callback(model, attrCount, finalCallback);
        });
    }
    songListDao.selectCreated(userId, function (songList) {
        model.songListList = songList;
        callback(model, attrCount, finalCallback);
    });
    songListDao.selectCollection(userId, function (songList) {
        model.collectionList = songList;
        callback(model, attrCount, finalCallback);
    });
}

router.post("/profile",function (req, res, next) {
    var userId = req.session.userId;
    var messageId = req.body.messId;
    if(userId && messageId){
        var conn = utils.getConnection();
        conn.query("update message set isRead = 1 where receiveUserId = ? and messId = ?",[userId,messageId]);
        utils.endConnection(conn);
    }
});

module.exports = router;