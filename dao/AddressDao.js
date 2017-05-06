/**
 * Created by Win on 2017/3/19.
 */
var utils = require('../utils');

exports.select = function (id, fn) {
    var conn = utils.getConnection();
    conn.query('SELECT p.addressId "proId",p.addressName "proName",c.addressId "cityId",c.addressName "cityName",d.addressId "disId",d.addressName "disName" FROM address p,address c,address d WHERE p.addressId = c.parentId AND c.addressId = d.parentId AND d.addressId = ?', [id], utils.selectResultHandler(fn));
    utils.endConnection(conn);
}