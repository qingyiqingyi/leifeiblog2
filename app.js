var express = require('express');
var path = require('path');//处理路径的连接方法join
var favicon = require('serve-favicon');//收藏夹
var logger = require('morgan');//记录日志的
//解析出req.cookies
var cookieParser = require('cookie-parser');
//解析出req.body
var bodyParser = require('body-parser');

//解析出缓存的在服务器端的session的值
var session=require('express-session');

var MongoStore = require('connect-mongo')(session);
var routes = require('./routes/index');
var user = require('./routes/user');
var article = require('./routes/article');
//设置了数据库的连接的地址   和缓存的密码
var settings=require('./settings');
//flash在客户端的页面上可以显示出来的跳出来的动画
var flash=require('connect-flash')
//可以应用中间件和不用了http等
var app = express();
var db=require('./db')
// view engine setup  views:key(生成模板的目录)     value:对应的真是的文件夹
app.set('views', path.join(__dirname, 'views'));
//模板引擎
app.set('view engine', 'html');
app.engine('html',require('ejs').__express)

// uncomment after placing your favicon in /public
//在你的public放了图标后可以取消此注释
app.use(favicon(path.join(__dirname,'public','favicon.ico')));
//生产依赖
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//session  密码操作 好缓存
app.use(session( {
//  获取到早settings中的密码
secret:settings.secret,
      resave:true,
      saveUninitialized:true,
      store:new MongoStore({
       url:settings.url
  })
}) )

//flash依赖我们的session
app.use(flash())
var fs=require('fs');
var ws=fs.createWriteStream('./access.log',{flags:'a'})
app.use(logger('tiny',{stream:ws}))//dev是一种日志的格式
app.use(function (req,res,next) {
  //为什么这里是获取值  因为在user中已经赋值了
  res.locals.user=req.session.user;
  res.locals.success=req.flash('success').toString();
  res.locals.error=req.flash('error').toString();
  res.locals.keyword='';
  next();
})
//本地的静态文件
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);//这个就是前面的路由吧后面的routes
app.use('/user', user);  //走这个路由
app.use('/article', article);
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
app.use(logger('dev',{stream: accessLog}));

//错误日志
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});
app.use(function (err, req, res, next) {
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  errorLog.write(meta + err.stack + '\n');
  next();
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('404',{})
 // next(err);
});

// error handlers

// development error handler
// will print stacktrace

//出现错误打印错误信息(堆栈)开发  express读取NODE_ENV来设置到app中去
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //errorLog.write(err.status+''+err.stack)
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user

//线上则不显示   错误信息因为上线了所以error是{}
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

/*
* createnewapp
*
*
*
*
* */