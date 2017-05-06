/**
 * Created by Win on 2017/3/4.
 */
var crypto = require('crypto');

exports.afterMD5 = function (str) {
    return crypto.createHash('md5').update(str, "UTF-8").digest("hex");
}
