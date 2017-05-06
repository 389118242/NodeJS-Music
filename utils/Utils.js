/**
 * Created by Win on 2017/2/28.
 */

var loadUtils = function (util) {
    for (var key in util) {
        exports[key] = util[key];
    }
}

exports.callback = function (model, num, fn) {
    if (Object.getOwnPropertyNames(model).length == num) {
        fn();
    }
}

exports.return404 = function (next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}

var mysqlUtil = require("./MysqlUtil");
var sqlResultHandler = require("./SQLResultHandler");
var stringAfterMD5 = require("./StringAfterMD5");


loadUtils(mysqlUtil);
loadUtils(sqlResultHandler);
loadUtils(stringAfterMD5);

