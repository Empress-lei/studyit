
var express = require('express');

var glob = require('glob');

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var session = require('express-session');

var app = express();

// 设置模板引擎
app.set('views','./views');
app.set('view engine', 'xtpl');

// 设置静态资源目录
app.use('/static', express.static('public'));
app.use('/static', express.static('uploads'));
app.use('/static', express.static('bower_components'));

// 解析请求主体(FormData)
app.use(bodyParser.urlencoded({ extended: false }));

// 解析cookie
app.use(cookieParser('studyit'));

// session
app.use(session({
	secret: 'studyit',
	resave: false,
	saveUninitialized: true,
	cookie: {maxAge: null}
}));

// 登录验证
app.use(function (req, res, next) {
	var url = req.originalUrl;

	// 全局赋值
	app.locals.loginfo = req.cookies.loginfo;

	if(url != '/login' && !req.session.loginfo) {
		return res.redirect('/login');
	}

	next();
});

// 自动载入控制器
var routes = glob.sync('./routes/*.js', {cwd: __dirname});
routes.forEach(function (item) {
	var route = require(item);

	typeof route === 'function' && app.use(route.prefix, route);
});

app.listen(3000);


