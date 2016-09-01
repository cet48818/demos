var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan'); // 日志
var cookieParser = require('cookie-parser'); // req.cookie方法, req.cookies对象
var bodyParser = require('body-parser'); // req.body
var exphbs  = require('express-handlebars');
var flash = require('connect-flash');

var routes = require('./routes/index'); // 加载路由, 根据请求路径不同进行不同的处理
var users = require('./routes/users');
var articles = require('./routes/articles');
var settings = require('./settings');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(settings.dbConnect);

// view engine setup
app.set('views', path.join(__dirname, 'views'));

var hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.html',
    helpers: {
      addOne: function(index) {
        return index+1;
      },
      subOne: function(index) {
        return index-1;
      },
      compare: function(v1, v2, options) {
        if (v1 > v2) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      },
      equal: function(v1, v2, options) {
        if (v1 == v2) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      },
    }
});
app.engine('html', hbs.engine);
app.set('view engine', 'html');

// 模版后缀为hbs时
// app.engine('hbs', 
//     exphbs({
//         defaultLayout: 'main',
//         extname: '.hbs',
//     }));
// app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json()); // json格式请求体, 通过请求头Content-Type判断
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// 使用了会话中间件之后, 就有了req.session属性
app.use(session({
  secret: settings.cookieSecret, // 加密密钥
  resave: false, // 默认为true, 建议false
  saveUninitialized: true, // 默认为true, 建议false
  // cookie: { secure: true } // https选ture
  store: new MongoStore({
    // 指定session保存的位置
    mongooseConnection: mongoose.connection
  })
}))
app.use(flash());
app.use(express.static(path.join(__dirname, 'public'))); // 静态文件服务
// 配置模版中间件
app.use(function(req, res, next) {
  // res.locals是真正的渲染模板的对象, 包含用于渲染视图的默认上下文
    // 赋值为session的user对象, 以便在全页面保存登陆状态
    res.locals.user = req.session.user;
    // 增加flash的success和erroe, 以便在全部页面使用
    // flash取出来的是数组
    // 如果是ejs模板, 需要把success和error用toString转成字符串便于在模板里正确判断
        // res.locals.success = req.flash('success').toString();
    // res.locals.keyword = req.session.keyword;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/articles', articles);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
