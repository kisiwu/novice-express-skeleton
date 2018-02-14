//novice-routing

var GetRouter = require('./router')

var routerForMethod = GetRouter();

function findMethodColor(method){
  var uppercaseMethod = method.toUpperCase().trim();
  var color = 0;
  switch(uppercaseMethod){
    case 'GET':
      color = 32;
      break;
    case 'POST':
      color = 33;
      break;
    case 'PUT':
      color = 36;
      break;
    case 'DELETE':
      color = 31;
      break;
    default:
      break;
  }
  return color;
}

function logFormatMethod(method){
  return '\x1b['+findMethodColor(method)+'m'+ method.toUpperCase() +'\x1b[0m';
}

exports = module.exports = Routing;

exports.findMethodColor = findMethodColor;
exports.logFormatMethod = logFormatMethod;

function Routing(options){
  this.options = options || {};
  this.options.secret = this.options.secret || "secret";
  this.options.authConfig = this.options.authConfig || {};
}

Routing.prototype.setRouter = function setRouter(router){
  routerForMethod = typeof router === "function" ? router : routerForMethod;
}

Routing.prototype.Router = function Router(){
  var router = routerForMethod;
	routerForMethod = GetRouter();
	return router;
}

Routing.prototype.route = function route(params, handlers){

  params = typeof params === "object" ? params : {path: params};

  var p_name = params.name;
  var p_description = params.description;
  var p_stacks = params.stacks || "*";
  var p_path = params.path;
  var p_method = params.method && typeof params.method === "string" ? params.method : "get";
  var p_validate = {};
  var p_responses = params.responses && typeof params.responses === "object" ? params.responses : {};
  var p_validator = params.validator;
      var p_auth = typeof params.auth === "boolean" ? params.auth : false;
      var p_info = params.info && typeof params.info === "object" ? params.info : {};

  if(!(p_path && typeof p_path === "string")){
    return this;
  }

  if(p_method.toLowerCase().trim() == "param"){
    routerForMethod["param"](p_path, handlers);
    return this;
  }

  // get only necessary validate
  if(params.validate && typeof params.validate === "object"){
    ['params','query','body','files'].forEach(
      p => {
        if(params.validate[p] && typeof params.validate === "object"){
          p_validate[p] = params.validate[p];
        }
      }
    );
  }

  var args = [];

  // route middlewares
  for (var i = 1; i < arguments.length; i++) {
      args[i-1] = arguments[i];
  }

  // validator middleware
  if(typeof p_validator === 'function' && Object.keys(p_validate).length){
    args.unshift(p_validator(p_validate));
  }

  if(p_auth){
          var jwt = require('express-jwt');

          var jwtOptions = {
                  secret: this.options.secret,
                  requestProperty: 'auth',
                  credentialsRequired: false,
                  getToken: function fromHeaderOrQuerystring (req) {
                      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Novice') {
                          var v = req.headers.authorization.split(' ')[1];
                          return v;
                      } else if (req.query && req.query.token) {
                          return req.query.token;
                      }
                      return null;
                  }
              };

          if(this.options.authConfig.expressJwtOptions){
              jwtOptions = this.options.authConfig.expressJwtOptions;
          }

          if(this.options.authConfig.afterHandler){
              args.unshift(this.options.authConfig.afterHandler);
          }

          args.unshift(function (req, res, next) {
            if (!req.auth) return res.sendStatus(401);
            next();
          });
          args.unshift(
            jwt(jwtOptions)
          );
  }

      var noviceRoute = {
                  name: p_name,
                  path: p_path,
                  stacks: p_stacks,
                  method: p_method,
                  auth: p_auth,
                  info: p_info,
                  description: p_description,
                  parameters: p_validate,
                  responses: p_responses
              };

      args.unshift(
          function (req, res, next) {
              req.noviceRoute = noviceRoute;
              next();
          }
      );
  args.unshift(noviceRoute);

  routerForMethod[p_method.toLowerCase()].apply(routerForMethod, args);
  return this;
}

Routing.prototype.ping = function ping(){
  console.log(this.options);
}
