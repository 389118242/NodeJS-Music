/**
 * Created by Win on 2017/3/6.
 */
var dateFormat = require("../utils/DateFormat");
var date1 = new Date('1999-09-08T16:00:00.000Z');
console.log(date1 + '   ' + dateFormat.toDate(date1));
console.log(date1 + '   ' + dateFormat.toDateTime(new Date()));