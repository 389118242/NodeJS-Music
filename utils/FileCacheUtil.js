/**
 * Created by Win on 2017/4/18.
 */

var fs = require('fs');
var utils = require('../utils');
var fileCache = {};
fileCache.img = {};

fileCache.music = {};

var fs = require('fs');
var getResourceId = function (fileName) {
    var index = fileName.indexOf("\.");
    return fileName.substring(0, index);
}

var imgFiles = fs.readdirSync("public/img");
for (var i in imgFiles) {
    var imgName = imgFiles[i];
    fileCache.img[getResourceId(imgName)] = imgName;
}

var musicFiles = fs.readdirSync("public/music");
for (var i in musicFiles) {
    var musicName = musicFiles[i];
    fileCache.music[getResourceId(musicName)] = musicName;
}

var runCB = function (cb) {
    if (cb)
        cb();
}

var callbackFN = function (err, result, id, type, cb) {
    if (err) {
        console.error(err);
        return;
    }
    var resource = result[0];
    if (resource) {
        var dir = "public/" + type + "/";
        var fileName = id + "." + resource.extension;
        var path = dir + fileName;
        fs.writeFileSync(path, resource.data);
        fileCache[type][id] = fileName;
    }
    runCB(cb);
}

var generate = function (type, id, reload, cb) {
    id += "";
    if (!reload && fileCache[type][id]) {
        runCB(cb);
        return;
    }
    var conn = utils.getConnection();
    conn.query("select * from resource where id = ?", [parseInt(id)], function (err, result) {
        callbackFN(err, result, id, type, cb);
    });
    utils.endConnection(conn);
}
exports.generate = generate;

exports.reload = function (type, id) {
    generate(type, id, true);
}

exports.getPath = function (type, id) {
    id += "";
    var fileName = fileCache[type] && fileCache[type][id];
    var path;
    if (fileName)
        path = "/" + type + "/" + fileName;
    return path;
}
