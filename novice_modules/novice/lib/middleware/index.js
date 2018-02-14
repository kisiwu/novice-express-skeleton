var Logger = require('../../logger');
var formatRequest = require('./formatRequest');
var formatResponse = require('./formatResponse');
var logs = require('./logs');

module.exports = function(novice, config){

  function formatReqRes(req, res, next){
      formatRequest(novice, req);
      formatResponse(novice, res);
      next();
  }

  function formatResApp(req, res, next) {
      var anonym = {
        id: null,
        username: "anonymous",
        isAnonymous: true,
        displayName: "Anonymous",
        emails:[]
      };
      var user = req.user;
      if(user !== undefined){
        user.isAnonymous = false;
        res.locals.app.user = user;
      }
      else{
        res.locals.app.user = anonym;
      }

      res.locals.app.custom = config.locals;

      next();
  }

  return [
    formatReqRes,
    formatResApp,
    logs
  ];
}
