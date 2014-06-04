var express = require('express');
var colors = require('colors');
var prop = require('./properties.js');
var logger = require('./logger');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('express-session');
var basicAuth = require('basic-auth');

var app = express();

app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(cookieSession({
  key: prop.key,
  secret: prop.secret,
  cookie: { path: '/', httpOnly: true, maxAge: null }
}));

app.use(clientErrorHandler);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//function control errors
function clientErrorHandler(err, req, res, next) {
  console.log('client error handler found in ip:' + req.ip, err);
  res.status(500);
  res.render('error', {locals: {"error": err} });
}

function match(username, password) {
  return (username == prop.username && password == prop.password);
}

//Mobile without auth
app.post('/logs/:appid', logger.addLog);
//Administration with auth
app.get('/logs/:appid/:id', logger.findByIdDetail);
app.get('/logsexport/:appid/:id', logger.findByIdDetailExport);
app.get('/logs/:appid', logger.findAll);
app.get('/logsexport/:appid', logger.findAllExport);
app.get('/mobiles', logger.findAllCollections);
app.get('/logs/:appi:id/delete', logger.deleteLog);
app.get('/logout', logger.logout);

console.log("------------------".yellow);
app.listen(prop.portWeb);
console.log('Listening on port '.yellow + prop.portWeb.red);

