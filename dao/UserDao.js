/**
 * Created by Win on 2017/3/4.
 */
var utils = require('../utils');

/**
 * 查询所有用户
 * @param fn
 */
exports.select = function (fn) {
    var conn = utils.getConnection();
    conn.query("select * from user", utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectByAccountAndPassword = function (account, password, fn, hasMD5) {
    var conn = utils.getConnection();
    var pwd = hasMD5 ? password : utils.afterMD5(password);
    conn.query("select * from user where userAccount=? and userPassword=?", [account, pwd], utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectById = function (id, fn) {
    var conn = utils.getConnection();
    conn.query("select userId,userAccount,userName,userDetail,userGender,userBirthDay,userAddress,userImg from user where userId=?", [id], utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectByAccount = function (account, fn) {
    var conn = utils.getConnection();
    conn.query("select userId from user where userAccount=?", [account], utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

/**
 * 添加用户
 * 必含字段：userAccount,userName,userPassword
 * @param user
 * @param fn
 */
exports.insert = function (user, fn) {
    var conn = utils.getConnection();
    user.userBirthDay = '1999-09-09';
    user.userPassword = utils.afterMD5(user.userPassword);
    conn.query("insert into user set ?", user, utils.insertOrUpdateResultHandler(fn));
    utils.endConnection(conn);
}

/**
 * 根据 userId 及 user 对象中的其他属性动态更新用户信息
 * “其他对象”数量不可为 0 ！
 * @param user
 * @param fn
 */
exports.update = function (user, fn) {
    var conn = utils.getConnection();
    var sql_prefix = 'update user set ';
    var params = new Array(0);
    for (var key in user) {
        if ('userId' !== key) {
            // sql_prefix += '?? = ?,';
            // params.push(key);
            sql_prefix += key + ' = ?,';
            params.push(user[key]);
        }
    }
    sql_prefix = sql_prefix.substring(0, sql_prefix.length - 1);
    var sql_suffix = ' where userId = ' + user.userId;

    conn.query(sql_prefix + sql_suffix, params, utils.insertOrUpdateResultHandler(fn))
    utils.endConnection(conn);
}

/**
 * 删除用户
 * @param userId
 * @param fn
 */
exports.delete = function (userId, fn) {
    var conn = utils.getConnection();
    conn.query("delete from user where userId = ?", [userId], utils.deleteResultHandler(fn));
    utils.endConnection(conn);
}