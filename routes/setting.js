/**
 * Created by Win on 2017/3/19.
 */
var express = require('express');
var router = express.Router();
var utils = require('../utils');
var dateFormat = require('../utils/DateFormat');
var userDao = require('../dao/UserDao');
var addressDao = require('../dao/AddressDao');

router.get('/setting', function (req, res, next) {
    var userId = req.session.userId;
    userDao.selectById(userId, function (users) {
        var user = users[0];
        var ret = {title: '设置', settingUser: user, dateFormat: dateFormat};
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
                res.render('setting', ret);
            })
        } else {
            res.render('setting', ret);
        }
    })
});
router.post('/setting', function (req, res, next) {
    var userId = req.session.userId;
    if (!userId) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
        return;// TODO 改为转发到登录界面
    }
    var user = req.body;
    user.userId = userId;
    userDao.update(user, function (effectRows) {
        var ret = effectRows == 1;
        res.json({ret: ret});
    })
});

module.exports = router;