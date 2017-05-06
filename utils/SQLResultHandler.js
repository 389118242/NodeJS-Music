/**
 * Created by Win on 2017/3/3.
 */
var fileCacheUtil = require("./FileCacheUtil");
var async = require("async");

var getAsyncFN = function (row, type) {
    var id = row.resourceId;
    var generate = function (cb) {
        fileCacheUtil.generate(type, id, false, cb);
    }
    var initPath = function (cb) {
        row[type] = fileCacheUtil.getPath(type, id);
        cb();
    }
    return id !== null ? [generate, initPath] : [];
}

var generateFile = function (rows, type, fn) {
    var tasks = [];
    for (var i in rows) {
        var row = rows[i];
        var fns = getAsyncFN(row, type);
        for (var j in fns) {
            tasks.push(fns[j]);
        }
    }
    async.series(tasks, function () {
        if (fn && typeof fn === 'function')
            fn(rows);
    });
}

exports.selectResultHandlerAndGenerateImg = function (fn) {
    return function (err, result) {
        if (err) {
            console.error(err);
            result = [];
        }
        generateFile(result, "img", fn);
    }
}

exports.selectResultHandlerAndGenerateMusic = function (fn) {
    return function (err, result) {
        if (err) {
            console.error(err);
            result = [];
        }
        generateFile(result, "music", fn);
    }
}

exports.selectResultHandler = function (fn) {
    return function (err, result) {
        if (err) {
            console.error(err);
            result = [];
        }
        if (fn && typeof fn === 'function')
            fn(result);
    }
}
exports.insertOrUpdateResultHandler = function (fn) {
    return function (err, result) {
        var affectedRows = 0;
        if (err)
            console.error(err);
        else {
            if (result.insertId === 0)
                affectedRows = result.affectedRows;
            else
                affectedRows = result.insertId;
        }
        if (fn && typeof fn === 'function')
            fn(affectedRows);
    }
}
exports.deleteResultHandler = function (fn) {
    return function (err) {
        if (err)
            console.error(err);
        fn(err ? false : true);
    }
}