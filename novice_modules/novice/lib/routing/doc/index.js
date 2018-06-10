var formats = {};

const DEFAULT_FORMATS = {
  console: require('./formats/console'),
  swagger: require('./formats/swagger')
};

exports = module.exports = DocBuilder;

/**
* @param {Object} novice Novice app
* @param {Object} router ExpressJS router
* @param {Object} config name of formats to use
*/
function DocBuilder(novice, router, config){

  this.built = false;

  config = config && typeof config === "object" ? config : {};

  Object.keys(config).map(
    format => {
      if(DEFAULT_FORMATS[format] && config[format] && !formats[format]){
        formats[format] = new DEFAULT_FORMATS[format](router, config[format], format);
      }
      else if(typeof config[format].classPath === "string"){
        console.log(novice);
        
        var ClassFile = novice.require(config[format].classPath);
        var args = [
          router,
          config[format].args,
          format
        ];
        args.unshift(ClassFile);
        formats[format] = new (ClassFile.bind.apply(ClassFile,args));
      }
    }
  );
}

DocBuilder.prototype.build = function build(name, host, basePath, schemes, info){

  Object.keys(formats).forEach( p => {
    if(p == 'console' && this.built){
      return;
    }

    formats[p].format(
      name || "Novice API",
      host || "",
      basePath || "/",
      schemes || [],
      info || {
        version: "1.0.0",
        license: {
          name: "MIT"
        }
      });
  });

  this.built = true;
}

DocBuilder.prototype.add = function add(routeCollection, routes){
  // Log routes
  routes.stack.forEach(function(stack){
    if(!stack.route){
      //console.log(stack);
      return;
    }
    //stack.route.path = ("/"+stack.route.path).replace(/\/{2,}/g,"/");
    var stackPath = (routeCollection.prefix+stack.route.path)
    var stackName = "";
    var stackDescription = "";
    var routeStacks = [];
    var routeParameters = {};
    var routeResponses = {};
    var routeSecurity;

    if(stack.route.meta){
      stackName = stack.route.meta.name || "";
      stackDescription = stack.route.meta.description || "";
      if(Array.isArray(stack.route.meta.stacks)){
        routeStacks = stack.route.meta.stacks;
      }
      routeParameters = stack.route.meta.parameters || routeParameters;
      routeResponses = stack.route.meta.responses || routeResponses;
      routeSecurity = stack.route.meta.auth;
    }
    if(stackPath.indexOf("//") == 0)
      stackPath = stackPath.replace("//","/");
    Object.keys(stack.route.methods).forEach(function(meth){
      if(~stack.route.path.indexOf("//") || stack.route.path.indexOf("/") != 0){
        Logger.warn("Something seems wrong with this path:", meth.toUpperCase(), stackPath, "( prefix:",routeCollection.prefix,"path:",stack.route.path,")");
      }
      else{

        Object.keys(formats).forEach( p => {
          formats[p].add({
            auth: routeSecurity,
            stacks: routeStacks,
            name: stackName,
            description: stackDescription,
            path: stackPath,
            method: meth,
            parameters: routeParameters,
            responses: routeResponses
          });
        });
      }
    });
  });
}
