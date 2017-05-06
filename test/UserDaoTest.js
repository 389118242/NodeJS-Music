/**
 * Created by Win on 2017/3/4.
 */

var userDao = require("../dao/UserDao");

userDao.insert({userAccount: "wz3927", userName: "王照", userPassword: "wz3927"}, function (num) {
    console.info('num...' + num);
});

userDao.select(function (results) {
    for (var i = 0; i < results.length; i++) {
        console.info(results[i].userName);
    }
});

userDao.selectByAccountAndPassword({userAccount: "wz3927", userPassword: "wz3927"}, function (ret) {
    console.info(ret);
});

userDao.update({userId: 14, userName: "Win", userDetail: "嘻嘻..."}, function (status) {
    console.info("status" + status);
});

userDao.delete(14, function (status) {
    if (status) {
        console.info("删除成功！");
    }
})