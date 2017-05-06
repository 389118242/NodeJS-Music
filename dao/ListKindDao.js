/**
 * Created by Win on 2017/3/3.
 */
var utils = require("../utils");

/**
 * 获取所有歌单类型
 * @param fn 查询结果集作为回调函数的参数
 */
exports.select = function (fn) {
    var conn = utils.getConnection();
    conn.query("select * from list_kind", function (err, result) {
        utils.selectResultHandler(err, result, fn)
    });
    utils.endConnection(conn);
};

/**
 * 插入歌单类型
 * @param kind_name
 * @param fn 影响行数作为回调函数的参数
 */
exports.insert = function (kind_name, fn) {
    var conn = utils.getConnection();
    conn.query("insert into list_kind set kindName = ?", kind_name, function (err, result) {
        utils.insertOrUpdateResultHandler(err, result, fn)
    });
    utils.endConnection(conn);
}

/**
 * 获取歌单的歌单类型
 * @param songListId 歌单 id
 * @param fn 查询结果集作为回调函数的参数
 */
exports.selectBySongListId = function (songListId, fn) {
    var conn = utils.getConnection();
    conn.query("select * from list_kind where kindId in (select lkId from sl_lk_relation where slId = ?)", songListId, function (err, result) {
        utils.selectResultHandler(err, result, fn);
    });
    utils.endConnection(conn);
}