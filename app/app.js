"use strict";
// ***IMPORTANT**: The following lines should be added to the very
//                 beginning of the main script!
var novice = require('./novice-bootstrap.js')(__dirname);
// ***

/** PROTOTYPES FOR JAVASCRIPT CLASSES */

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

/** /PROTOTYPES FOR JAVASCRIPT CLASSES */


const logger = require('novice').logger;


/**
 * register the configuration files
 */
novice.registerConfigFiles(
  'novice',
  'dogma',
  'parameters',
  'services',
	'middlewares'

  // REGISTER YOUR CONFIG FILES HERE

);

var app = novice.buildApp();

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

  logger.error(err);
	var status = err.status || 500;
    res.status(status);
    res.json({
	  status: status,
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {

  logger.error(`An error occured`);
  console.error(err);

  var status = err.status || 500;
  res.status(status);
  res.json({
	status: status,
    message: err.message,
    error: {}
  });
});

// to get a remote user IP address in req.ip
//app.enable('trust proxy');

module.exports = novice;
