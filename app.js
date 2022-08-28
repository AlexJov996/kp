'use strict';
console.log('CHROMIUM helper init');

const express 		= require('express');
const morgan 	    = require('morgan');
const bodyParser 	= require('body-parser');
const routes        = require('./routes');
const app           = express();

app.use(morgan('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

app.use('/chr', routes);

app.use('/', function(req, res){
	res.statusCode = 404;//send the appropriate status code
	res.json({status:"Error", message:"Not Found", data:{}})
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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

//This is here to handle all the uncaught promise rejections
process.on('unhandledRejection', (reason, p) => {
    console.error('Uncaught promise Error', reason, p);
});

module.exports = app;