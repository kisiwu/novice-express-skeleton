const http         = require('http'),
      fs           = require('fs'),
      path         = require('path'),
      env          = process.env;

const noviceApp = require('./app/app.js');
const expressApp = noviceApp.getApp();

const logger = require('novice/logger');

// build doc
noviceApp.buildDoc(
  // name
  "Novice Express",
  // host
  "host.com",
  // base url
  "/",
  // schemes
  ['http', 'https'],
  // other
  {
    "consumes": [
      "application/json",
      "multipart/form-data"
    ],
    "produces": [
      "application/json",
      "text/html",
      "text/plain"
    ]
  }
);

// IMPORTANT: Your application HAS to respond to GET /health with status 200
//            for health monitoring
const server = http.createServer(expressApp);

var port = process.env.PORT || 8000,
    processIP   = process.env.IP   || '0.0.0.0';

server.listen(port, processIP, function () {
  logger.info(`Application worker ${process.pid} started...`);
  logger.info(`Server running on http://${processIP}:${port}`);

});
