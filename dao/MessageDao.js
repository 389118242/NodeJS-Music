/**
 * Created by Win on 2017/3/19.
 */
var utils = require('../utils');

// message Type
// 1. COMMENT comment
// 2. REPLY reply
// 3. PRIVATE private letter

exports.selectNoReadMessageByUserId = function (userId, fn) {
    var conn = utils.getConnection();
    conn.query("select count(*) noRead from message where isRead = 0 and receiveUserId = ?", [userId], utils.selectResultHandler(fn));
    utils.endConnection(conn);
}

exports.selectMessageByUserIdAndMessageType = function (userId, messageType, fn) {
    var conn = utils.getConnection();
    conn.query("select m.*,u.userId,u.userName from message m,user u where m.sendUserId = u.userId and receiveUserId = ? and messType = ? order by isRead", [userId, messageType], utils.selectResultHandler(fn));
    utils.endConnection(conn);
}