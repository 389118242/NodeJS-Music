/**
 * Created by Win on 2017/3/6.
 */

var formate = function (num) {
    return num > 9 ? num : '0' + num;
}
var toDate = function (obj, flag) {
    var date = undefined;
    if (flag) {
        date = obj;
    } else {
        date = new Date(obj);
    }
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return year + '-' + formate(month) + '-' + formate(day);
}

var toDateTime = function (str) {
    var date = new Date(str);
    var houts = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    return toDate(date, 1) + " " + formate(houts) + ":" + formate(min) + ":" + formate(sec);
}

module.exports = {
    toDate: toDate,
    toDateTime: toDateTime
}
