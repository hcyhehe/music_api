const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');  //express自带的日志模块
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');
const rfs = require('rotating-file-stream');  //用于切割日志
const http = require('http');
const cors = require('cors');
const code = require('./commons/code');
const app = express();
const apiRouter = require('./routes/api_router');

const port = process.env.PORT || '8086'


const logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);  //确保日志文件夹存在
const accessLogStream = rfs('access.log', {  //创建一个轮询的写操作流
  interval: '1d',  //每天轮询
  path: logDirectory
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));  //输出到控制台
app.use(logger('common', {stream: accessLogStream}));  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());  //跨域模块

app.use('/music/api/', apiRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  return res.send({"code": 4040000, "msg": code['4040000']});
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  return res.send({"code": 5000000, "msg": code['5000000']});
})


const server = http.createServer(app)
const io = require('socket.io')(server)


server.listen(port, function(){
  console.log('server is up on '+port)
})


module.exports = app
