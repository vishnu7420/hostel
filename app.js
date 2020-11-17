var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors')
var http = require("http").Server(app);
require('dotenv').config()

var app = express();
var environment = process.env.NODE_ENV;
console.log(environment, "NODE_ENV")
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.set('view engine', 'ejs')
app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/public'));

app.get('/web/privacypolicy', (req, res) => {

  res.render('privacy_policy')
});

app.use('/images', express.static(__dirname + '/images'));
// app.use('/template', express.static(__dirname + '/template'));



var userRouter = require('./routes/user.routes'); //importing route
var subscriptionRouter = require('./routes/subscription.routes'); //importing route
var roomdetailRouter = require('./routes/roomdetails.routes'); //importing route


app.use('/api', userRouter)
app.use('/api', subscriptionRouter)
app.use('/api', roomdetailRouter)







var port = process.env.PORT || 2407
console.log(port )
app.listen(port, function () {
  console.log('Server running on port: %d', port);

});

module.exports = app;

