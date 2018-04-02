var path = require('path');
var apm = require('app-module-path');
var noviceParams = require('novice-parameters');
var NoviceServiceBag = require('./config/service-bag');
var NoviceParameterBag = require('./config/parameter-bag');
var noviceRouteCollectionClass = require('./config/route-collection');
var NoviceRoutingClass = require('./routing');
var RoutesDocBuilderClass = require('./routing/doc');
var DocBuilder;
var GetNoviceMiddlewares = require('./middleware');

var NoviceRouting = new NoviceRoutingClass();
var Logger = require('../logger');

var public_dirname = 'public';

var InstanceExists = false;
var params = null;
var configFiles = [];

var documentationFormat = {};

var authConfig = {}; //afterHandler, expressJwtOptions

var localsConfig = {}; // response locals (app.custom)

var Routing =
{
    resource: 'routing'
};

var beginingState =
{
    routeCollectionClass: function() {return noviceRouteCollectionClass;}
};

var lastInit = undefined;
var stdRouter = function(){return require('express').Router()};
var routerForMethod = stdRouter();

var app = exports = module.exports = beginingState;

function noviceRequire(pathOne, pathTwo) {
    return require(resolvePath(pathOne, pathTwo));
};

function resolvePath(pathOne, pathTwo) {
  var firstArg = '';
  if(lastInit){
    firstArg = lastInit.params.getProjectRoot();
  }
  if(pathTwo)
    return path.join(firstArg, pathOne, pathTwo);
  else
    return path.join(firstArg, pathOne);
};

/** EXPORTS:
*
* logger
* require
* resolvePath
* InstanceExists
* getLastInit
* setRouter
* Router
* route
*/

exports.logger = Logger;
exports.require = noviceRequire;
exports.resolvePath = resolvePath;
exports.InstanceExists = function () {return InstanceExists;}
exports.getLastInit = function getLastInit(){
    return lastInit ;
}
exports.setRouter = function(router){
  return NoviceRouting.setRouter(router);
	//routerForMethod = typeof router === "function" ? router : routerForMethod;
};
exports.Router = function(){
  return NoviceRouting.Router();
};
exports.route = function(){
    return NoviceRouting.route.apply(NoviceRouting, arguments);
};

/*** /EXPORTS */

app.init = function init (){

    if (!exports.InstanceExists()) {

        this.params = noviceParams;
        params = this.params;
        InstanceExists = true;
    }
    else
    {
        console.log("An instance of Novice already exists");
        this.params = params;
    }

    this.services = {};

    lastInit = this;

    //return this;
}

app.ConfigureExpressApp = function ConfigureExpressApp(app)
{
    var instance = this;

    var appName = noviceRequire('', 'package.json').name;

    //Logger.info(`name: ${appName}`);

    /****** settings *****/
    app.set('name', appName);
    // view engine setup
	  app.set('views', resolvePath('views'));

	   try {
		     var pug = require('pug');
		     app.set('view engine', 'pug');
	   } catch (ex) {}

    var configureFromFiles = function (app)
    {
        for (var index = 0; index < configFiles.length; index++) {
            var element = configFiles[index];
            var fileObj = require(path.join(instance.params.getConfigDir(), '', element));

            for (var property in fileObj) {
                if (property == 'novice') {
                    instance.ConfigureNovice(fileObj['novice'], app);
                }
                else if (property == 'mysql') {
                    instance.ConfigureMysql(fileObj['mysql']);
                }
                else if (property == 'mongodb') {
                    instance.ConfigureMongoDB(fileObj['mongodb']);
                }
                else if(property == 'parameters')
                {
                    var parameters = fileObj[property];
                    for(var p in parameters){
                        pttParams[p] = parameters[p];
                    }
                }
                else if(property == 'services')
                {
                    var services = fileObj[property];
                    for(var p in services){
                        pttServices[p] = services[p];
                    }
                }
            }
        }
    }

    /***** parameters and services registration *****/

    var pttServices = {};
    var pttParams = {};
    configureFromFiles(app);

    var pb = instance.parameterBag = new NoviceParameterBag(pttParams, instance);
    instance.setParameter('novice.app_root', this.params.appRoot);
    instance.setParameter('novice.project_dir', this.params.projectRoot);
    instance.setParameter('novice.config_dir', this.params.configDir);

    instance.setParameter('novice.service_dir', path.join('%novice.project_dir%', 'services'));
    instance.setParameter('novice.utils_dir', path.join('%novice.project_dir%', 'utils'));


    var sb = instance.serviceBag = new NoviceServiceBag(pttServices, instance);

    /***** /parameters and services registration *****/

    /****** middlewares *****/

    var noviceMiddlewares = GetNoviceMiddlewares(instance, {locals: localsConfig});
    app.use.apply(app, noviceMiddlewares);

    /****** /middlewares *****/
};

app.getServiceIds = function getServiceIds()
{
    var instance = this;
    return instance.serviceBag.getServiceIds();
};

app.getService = function getService(name)
{
    var instance = this;
    return instance.serviceBag.get(name);
};

app.setService = function setService(name, any)
{
    var instance = this;
    return instance.serviceBag.set(name, any);
};

app.getParameter = function getParameter(name)
{
    var instance = this;
    return instance.parameterBag.get(name);
};

app.setParameter = function setParameter(name, any)
{
    var instance = this;
    return instance.parameterBag.set(name, any);
};

/*app.ConfigureExpressRouting = function ConfigureExpressRouting(app, routing)
{
    var instance = this;
    for(property in routing) {
        app.use(routing[property], require(path.join(instance.params.getProjectRoot(), 'routes', property.replace('__', path.sep))));
    }
};*/

app.ConfigureExpressRouting = function ConfigureExpressRouting(app)
{
    if (!(app != null && typeof app == "function")) {
        throw new TypeError("Novice::ConfigureExpressRouting - Argument 1 must be Express app");
    }

    NoviceRouting = new NoviceRoutingClass({authConfig: authConfig, secret: params.secret});

    DocBuilder = new RoutesDocBuilderClass(this, app, documentationFormat);

    var instance = this;

    var routingfile = path.join(instance.params.getConfigDir(), '', Routing.resource);
    var routing = require(routingfile);

    for(var property in routing) {
        var routeCollection = routing[property];
        if (!(routeCollection instanceof noviceRouteCollectionClass)) {
            routeCollection = new noviceRouteCollectionClass(routeCollection);
        }
        //console.log(routeCollection.prefix+" : "+routeCollection.getResource());
        var routers = noviceRequire('routes', routeCollection.getResource());
        //require(path.join(instance.params.getProjectRoot(), 'routes', routeCollection.getResource()));

        if(!Array.isArray(routers)){
          routers = [routers];
        }

        routers.forEach(function(routes){

          if(routes){

            if(routes.stack){

              // document the routes
              DocBuilder.add(routeCollection, routes);

              // register the routes
              app.use(routeCollection.prefix, routes);
            }
          }

        });
    }

    //Logger.silly("public dir ---- ", path.join(instance.params.getProjectRoot(), public_dirname) );
    //app.use(require('express').static(path.join(instance.params.getProjectRoot(), public_dirname)));
    Logger.silly("public dir ---- ", resolvePath(public_dirname) );
    app.use(require('express').static(resolvePath(public_dirname)));
};

app.ConfigureMysql = function ConfigureMysql(mysql)
{
    var instance = this;
    if(mysql !== undefined){
	    instance.services.mysql = {};
	    for(property in mysql) {
		    var mysqlConnect = require('mysql-connect');
		    mysqlConnect.config = mysql[property];
		    instance.services.mysql[property] = mysqlConnect;
	    }
    }
};

app.ConfigureMongoDB = function ConfigureMongoDB(mongodb)
{
    var instance = this;
    if(mongodb !== undefined){
	    instance.services.mongodb = {};
	    for(property in mongodb) {
		    var mongoConnect = require('mongodb-connect');
		    mongoConnect.config = mongodb[property].options || {};
            mongoConnect.url = mongodb[property].url || "" ;
		    instance.services.mongodb[property] = mongoConnect;
	    }
    }
};

app.ConfigureNovice = function ConfigureNovice(novice, app)
{
    var instance = this;

    var router = function (params) {
        if (typeof params == 'string') {
            Routing.resource = params || Routing.resource;
        }
    }

    var middlewares = function (params, app) {
        if (typeof params == 'object') {
            for (var index = 0; index < params.length; index++) {
                var element = params[index];
                app.use(element);
            }
        }
    }

    var locals = function (params, app) {
        if (params && typeof params == 'object') {
          Object.keys(params).forEach(
            p => {
              localsConfig[p] = params[p];
            }
          );
        }
    }

    var view = function (param, app) {
        if (typeof param != 'object') {
            return;
        }
        if (typeof param.engine == 'string') {
            app.set('view engine', param.engine);
        }
    }

    var setFavicon = function (param, app) {
        var favicon = require('serve-favicon');
        if (typeof param == 'string') {
            app.use(favicon(path.join(instance.params.getProjectRoot(), public_dirname, param)));
        }
    }

	var corsEnabled = false;
	var cors;

	var enableCors = function (param, app) {
        if (typeof param === 'boolean' && param) {
          if(typeof cors === 'undefined'){
				    cors = require('cors');
			    }
			    if(!corsEnabled){
				    app.options('*', cors());
				    corsEnabled = true;
			    }
			    app.use(cors());
        }
		    else if(typeof param === 'object'){
			     if(typeof cors === 'undefined'){
				         cors = require('cors');
			      }

            var corsOptionsDelegate = param;
            var privatePaths = Array.isArray(param.privatePaths) ? param.privatePaths : null;
            var blacklist = Array.isArray(param.blacklist) ? param.blacklist : null;
            delete param.privatePaths;
            delete param.blacklist;

            /*
            if(privatePaths)
              Logger.warn("private paths", privatePaths);
            if(blacklist)
              Logger.warn("blacklist origins", blacklist);
            */

            var isPrivatePath = function(path){
              if(!privatePaths) return false;

              return privatePaths.some(str => {
                return (new RegExp(str)).test(path);
              });
            }

            var isBlackListed = function(origin){
              if(!blacklist) return false;

              return blacklist.indexOf(origin) > -1;
            }
            corsOptionsDelegate = function(req, callback){
                    var corsOptions = {};
                    for (var p in param) {
                        corsOptions[p] = param[p];
                    }
                    // corsOptions.origin = true; // reflect (enable) the requested origin in the CORS response

                    if(isBlackListed(req.header('Origin'))){
                      corsOptions.origin = false; // disable CORS for this request
                    }
                    if(isPrivatePath(req.path)){
                      Logger.warn("[NOVICE CORS] private path", req.path);
                      corsOptions.origin = false; // disable CORS for this request
                    }

                    //Logger.warn(corsOptions);
				            callback(null, corsOptions); // callback expects two parameters: error and options
			      };
            if(!(typeof corsOptionsDelegate === 'function') && privatePaths){

            }
            if(!corsEnabled){
				          app.options('*', cors(corsOptionsDelegate));
				          corsEnabled = true;
			      }
			      app.use(cors(corsOptionsDelegate));
		}
		else if(typeof param === 'function'){
			if(typeof cors === 'undefined'){
				cors = require('cors');
			}
			if(!corsEnabled){
				app.options('*', cors(param));
				corsEnabled = true;
			}
			app.use(cors(param));
		}
    else if(Array.isArray(param)){
            if(typeof cors === 'undefined'){
				          cors = require('cors');
			      }
            Logger.warn("whitelist origins", param);
            var corsOptionsDelegate = function (req, callback) {
                var corsOptions = {origin: false};
                if (param.indexOf(req.header('Origin')) !== -1) {
                    corsOptions = {origin: true}; // reflect (enable) the requested origin in the CORS response
                } else {
                    corsOptions.origin = false; // disable CORS for this request
                }
                callback(null, corsOptions); // callback expects two parameters: error and options
            };
			if(!corsEnabled){
				app.options('*', cors(corsOptionsDelegate));
				corsEnabled = true;
			}
			app.use(cors(corsOptionsDelegate));
		}
    }

    var auth = function (param, app) {
        if (typeof param === 'object') {
            authConfig = param;
        }
    }

    var docFormats = function (param, app) {
        if (param && typeof param === 'object') {
            documentationFormat = param;
        }
    }



    if(novice !== undefined){
      router(novice.router);
      middlewares(novice.middlewares, app);
      locals(novice.locals, app);
      view(novice.view, app);
      setFavicon(novice.favicon, app);
		  enableCors(novice.cors, app);
      auth(novice.auth, app);
      docFormats(novice.docFormats, app);
    }
};

app.registerConfigFiles = function registerConfigFiles(array)
{
    if (arguments.length == 1 && Array.isArray(array) ) {
        configFiles = array;
    }
    else
    {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == 'string') {
                configFiles.push(arguments[i]);
            }
        }
    }
};

app.buildApp = function buildApp() {

    var app = require('express')();

    this.ConfigureExpressApp(app);

    this.parameterBag.resolveAll();

    this.ConfigureExpressRouting(app);

    //this.parameterBag.resolveAll();

    this.getApp = function(){
      return app;
    }

    return app;
};

app.buildDoc = function(){
  if(DocBuilder){
    DocBuilder.build.apply(DocBuilder, arguments);
  }
}
