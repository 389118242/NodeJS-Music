/**
 * Created by Win on 2017/2/28.
 */
var mysql = require("mysql");
var config = require("../conf/database.json");
exports.getConnection = function () {
    var conn = mysql.createConnection(config)
    return conn;
}
exports.endConnection = function (conn) {
    if (conn) {
        conn.end(function (err) {
            if (err)
                console.log(err.message);
            else {
                console.log("database connection closed successful!");
            }
            conn = undefined;
        });
    }
}
