var Logger = require('../../logger');

module.exports = function(req, res, next){
  if(req.get('x-forwarded-host')){
    Logger.info("xfhost", ":", req.get('x-forwarded-host'));
  }
  next();
}
