var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var fs = require('fs');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var myJson=require('./test');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//替换表格<%
var codeReplace=function (str) {
    var objectKey=str.match(/buildCode="(.*?)"/);
    var buildCode=objectKey[1];
    var contentArray=str.match(/buildCode=".*?"([\s\S]*?)%>/);
    var content=contentArray[1];
    var myArray=myJson.content[buildCode];
    var str="";
    myArray.forEach(function (item,index,arr) {
      var temporary=content;
      temporary=temporary.replace(/{{{title}}}/g,item.title);
      str+=temporary.replace(/{{{key}}}/g,item.key);
    });
    return str;
};

//替换变量{{{
var keyReplace=function (str) {
    var objectKey=str.match(/{{{(.*?)}}}/);
    var buildCode=objectKey[1];
    return myJson.content[buildCode];
};

//读取模板文件
fs.readFile('./template.vuet', 'utf8', function(err, data){
    if(err) throw err ;
    var str=data.toString();
    console.log("______");
    //替换循环类代码
    str=str.replace(/<%[\s\S]*?%>/g,codeReplace);
    console.log(str);
    console.log("______");
    //替换变量类代码
    str=str.replace(/{{{[\s\S]*?}}}/g,keyReplace);
    console.log(str);
    fs.createWriteStream('./'+myJson.content.englishName+'.vue');
    fs.writeFile('./'+myJson.content.englishName+'.vue', str,  function(err) {
        if (err) {
            return console.error(err);
        }
        console.log("数据写入成功！");
    });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
