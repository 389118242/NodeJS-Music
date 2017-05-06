/**
 * Created by Win on 2017/3/3.
 */
var listKindDao = require("../dao/ListKindDao");

listKindDao.insert("插入测试2", function (rows) {
    console.info(rows);
});

listKindDao.select(function (kinds) {
    for (var i = 0; i < kinds.length; i++) {
        var kind = kinds[i];
        console.info(kind.kindId + '---' + kind.kindName);
    }
});

listKindDao.selectBySongListId(23, function (kinds) {
    for (var i = 0; i < kinds.length; i++) {
        var kind = kinds[i];
        console.info(kind.kindId + '---' + kind.kindName);
    }
});