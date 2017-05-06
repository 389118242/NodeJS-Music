/**
 * Created by Win on 2017/3/19.
 */
var addressDao = require('../dao/AddressDao');
addressDao.select('110101',function (ret) {
    console.log(ret);
})