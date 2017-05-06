var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var userDao = require('./dao/UserDao');

var index = require('./routes/index');
var alterPwd = require('./routes/alterPwd');
var editSongList = require('./routes/editSongList');
var album = require('./routes/album');
var allList = require('./routes/allList');
var login = require('./routes/login');
var register = require('./routes/register');
var myMusic = require('./routes/myMusic');
var profile = require('./routes/profile');
var search = require('./routes/search');
var setting = require('./routes/setting');
var song = require("./routes/song");
var comment = require("./routes/comment");
var singer = require("./routes/singer");
var songList = require("./routes/songList");
var recommendSongList = require("./routes/recommendSongList");
var open_api = require("./routes/open-api-for-back");
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: Math.random().toString(13).substr(2), // 建议使用 128 个字符的随机字符串
    cookie: {maxAge: 30 * 60 * 1000}
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    next();
})
app.use("/Music", open_api);
app.use(function (req, res, next) {
    if (req.session.userId) {
        next();
        return;
    }
    var userInfo = req.cookies.musicLogin;
    if (userInfo) {
        var user = userInfo.split(':');
        userDao.selectByAccountAndPassword(user[0], user[1], function (ret) {
            if (ret[0]) {
                var user = ret[0];
                if (user.userState === 1)
                    req.session.userId = user.userId;
            } else {
                res.cookie("musicLogin", undefined, {maxAge: 0});
            }
            next();
        }, true);
    } else {
        next();
    }
});
app.use('/Music', song);
app.use('/Music', comment);
app.use('/Music', singer);
app.use('/Music', songList);
app.use('/Music', recommendSongList);
app.use('/Music', index);
app.use("/Music", login);
app.use("/Music", register);
app.use('/Music', album);
app.use("/Music", allList);
app.use("/Music", search);

app.use(function (req, res, next) {
    if (!req.session.userId)
        res.redirect("login");
    else
        next();
});

app.use('/Music', editSongList);
app.use('/Music', myMusic);
app.use('/Music', profile);
app.use('/Music', alterPwd);
app.use('/Music', setting);
app.use('/Music', users);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error', {title: "ERROR"});
});

module.exports = app;
