module.exports = function(novice, res){

  var pkg = novice.require('', 'package.json');

  function reply(code, response, err){
    if(!code){
      code = 200
    }
    else if(code instanceof Error){
      response = code;
      code = 500;
    }

    if(typeof response === 'string'){
      response = {message: response}
    }

    if(typeof response === 'undefined' || response == null){
      switch(code){
        // 400 Bad Request
        case 400:
          response = {message: "Bad Request"}
          break;
        // 401 Unauthorized
        case 401:
          response = {message: "Unauthorized"}
          break;
        // 402 Payment Required
        case 402:
          response = {message: "Payment Required"}
          break;
        // 403 Forbidden
        case 403:
          response = {message: "Forbidden"}
          break;
        // 404 Not Found
        case 404:
          response = {message: "Not Found"}
          break;
        // 405 Method Not Allowed
        case 405:
          response = {message: "Method Not Allowed"}
          break;
        // 406 Not Acceptable
        case 406:
          response = {message: "Not Acceptable"}
          break;
        default:
          response = {}
          break;
      }
    }

    if(response && !Array.isArray(response) && typeof response === 'object' && err){
      if(code > 299 && typeof response.error === 'undefined'){
        response.error = err;
      }
    }
    return res.status(code).json(response);
  }

  // set functions
  res.reply = reply;

  // set headers
  res.set('X-Powered-By', 'Novice-Express');

  // set locals
  res.locals.app = {
    user: null,
    name: pkg.name,
    version: pkg.version,
    custom: {}
  };
}
