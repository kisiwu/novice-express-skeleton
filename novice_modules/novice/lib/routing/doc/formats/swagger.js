const logger = require('novice/logger');

var swaggerv2 = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Novice API",
    "license": {
      "name": "MIT"
    }
  },
  "host": "",
  "basePath": "/",
  "schemes": [
    "http"
  ],
  "consumes": [],
  "produces": [],
  "securityDefinitions": {
    "NoviceAuth": {
      "type": "apiKey",
      "in": "header",
      "name": "Authorization"
    }
  },
  "paths": {},
  /*"definitions": {
    "Pet": {
      "required": [
        "id",
        "name"
      ],
      "properties": {
        "id": {
          "type": "integer",
          "format": "int64"
        },
        "name": {
          "type": "string"
        },
        "tag": {
          "type": "string"
        }
      }
    },
    "Pets": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Pet"
      }
    },
    "Error": {
      "required": [
        "code",
        "message"
      ],
      "properties": {
        "code": {
          "type": "integer",
          "format": "int32"
        },
        "message": {
          "type": "string"
        }
      }
    }
  }
  */
};

exports = module.exports = Swagger;

function Swagger(router, pathToDoc){

  pathToDoc = pathToDoc && typeof pathToDoc === "string" ? pathToDoc : "/doc/swagger";

  this.addRoute = function(){
    router.get(pathToDoc, function (req, res){
      return res.status(200).json(swaggerv2);
    });
    logger.info(`Documentation: Swagger @ ${pathToDoc}`);
  };
}

Swagger.prototype.add = function add(route){
  // stacks (tags), name, description, path, method, parameters

  var path = formatPath(route.path, route.parameters["params"]);

  swaggerv2.paths[path] = swaggerv2.paths[path] || {};

  swaggerv2.paths[path][route.method] = {
    "summary": route.description,
    //"operationId": (route.name || (route.method + ':' + route.path)) + ' (' + route.stacks.join(' ,') + ')',
    "tags": route.stacks,
    "parameters": formatParameters(route.parameters),
    "responses": formatResponses(route.responses)
  }

  if(route.auth){
    swaggerv2.paths[path][route.method].security = [{
      "NoviceAuth": []
    }];
  }
}

Swagger.prototype.format = function format(name, host, basePath, schemes, info){

  swaggerv2.info.title = name || swaggerv2.info.title;
  swaggerv2.host = host || swaggerv2.host;
  swaggerv2.basePath = basePath || swaggerv2.basePath;
  swaggerv2.schemes = schemes || swaggerv2.schemes;

  swaggerv2.info.version = info.version || swaggerv2.info.version;
  swaggerv2.info.license = info.license || swaggerv2.info.license;


  swaggerv2.consumes = Array.isArray(info.consumes) ? info.consumes : swaggerv2.consumes;
  swaggerv2.produces = Array.isArray(info.produces) ? info.produces : swaggerv2.produces;

  // others
  Object.keys(info).forEach(
    p => {
      if(["title","host","basePath","schemes","version","license","consumes","produces","securityDefinitions","path"].indexOf(p) == -1){
        swaggerv2[p] = info[p];
      }
    }
  );
  
  this.addRoute();
}

function formatPath(path, params){

  if(params && typeof params === "object"){
    var pos = path.indexOf('/:');

    // found express parameters notation
    if(pos > -1){

      var pathEnd = path;
      path = "";

      while(pos > -1){
        var fromParamPath = pathEnd.substr(pos+2);
        var endPos = fromParamPath.indexOf("/");

        // path param name
        var variableName = fromParamPath;
        if(endPos > -1) {
          variableName = fromParamPath.substring(0, endPos);
        }

        path += pathEnd.substring(0, pos+1);

        // if path param name is found in route meta parameters
        if(params[variableName]){
          path += "{"+ variableName +"}";
        }
        else{
          path += ":"+ variableName
        }

        if(endPos > -1){
          pathEnd = fromParamPath.substring(endPos);
        }
        else {
          pathEnd = "";
        }
        pos = pathEnd.indexOf('/:');
      }

      path += pathEnd;
    }

  }

  return path;
}

function formatParameters(routeConfig){
  // format parameters
  var parameters = [];

  Object.keys(routeConfig).forEach(
    place => {
      var ps = routeConfig[place];
      if(["query", "params", "files"].indexOf(place) > -1){
        // push query|path param
        pushPathParameters(place, ps, parameters);
      }
      else if(['body'].indexOf(place) > -1){
        // push body param
        pushBodyParameters(place, ps, parameters);
      }
    }
  );

  return parameters;
}

function pushBodyParameters(place, ps, parameters){
  var param = {
    "name": "body",
    "in": "body",
    "required": true,
    "schema": {
      "type": "object",
      "required": [],
      "properties": {}
    }
  };

  Object.keys(ps).forEach( name => {

    var configParameter = ps[name];

    if(!configParameter.isJoi)
      return;

    schemaJoiPropertyValidation(name, configParameter, param["schema"]);
  });

  if(!param.schema.required.length){
    delete param.schema.required;
  }

  parameters.push(param);
}

function pushPathParameters(place, ps, parameters){
  Object.keys(ps).forEach( name => {

    var configParameter = ps[name];

    if(!configParameter.isJoi)
      return;

    var param = {};
    param["name"] = name;
    switch(place){
      case "params":
        param["in"] = "path";
        break;
      case "files":
        param["in"] = "formData";
        break;
      default:
        param["in"] = place;
        break;
    }

    var joiParam = formatJoiPropertyValidation(place, configParameter);

    Object.keys(joiParam).forEach( p => {
      param[p] = joiParam[p];
    });

    parameters.push(param);

  });
}

function schemaJoiPropertyValidation(name, configParameter, schema){
  var param = {
    "type": getType(configParameter._type)
  };

  if(configParameter._description){
    param["description"] = configParameter._description;
  }

  // required
  if(configParameter._flags.presence == "required"){
    if(schema.type == "object"){
      schema.required = schema.required || [];
      if(schema.required.indexOf(name) == -1){
        schema.required.push(name);
      }
    }
    else if(schema.type == "array"){
      schema["minItems"] = schema["minItems"] || 1;
    }
    else{
      param["required"] = true;
    }
  }

  // array items
  if(param.type == "array"){

    // schema item
    if(configParameter._inner && configParameter._inner.items && configParameter._inner.items[0]){
      param["items"] = {}
      schemaJoiPropertyValidation("items", configParameter._inner.items[0], param);
    }
    else{
      param["items"] = {
        type: getType("any")
      }
    }

  }

  // default
  if(typeof configParameter._flags.default != "undefined"){
    param.default = configParameter._flags.default;
  }

  // allowEmptyValue
  // param.allowEmptyValue = !configParameter._invalids._set.some(v => { return ['', null].indexOf(v) > -1; });

  // enum
  if(configParameter._flags.allowOnly && configParameter._valids._set.length){
    param.enum = configParameter._valids._set;
  }

  // tests
  configParameter._tests.forEach( test => {
    switch(test.name){
      case "min":
        var propName = "minimum";
        if(param.type == "array"){
          propName = "minItems";
        }
        param[propName] = test.arg;
        break;
      case "max":
        var propName = "maximum";
        if(param.type == "array"){
          propName = "maxItems";
        }
        param[propName] = test.arg;
        break;
      case "unique":
        if(param.type == "array"){
          param["uniqueItems"] = true;
        }
        break;
      default:
        break;
    }
  });

  // unit
  if(configParameter._unit){
    param.description += (param.description ? " " : "") + "("+configParameter._unit+")";
  }

  // object keys
  if(param.type == "object"){
    // check if it has defined keys
    if(configParameter._inner && Array.isArray(configParameter._inner.children) && configParameter._inner.children.length){
      param.properties = {};
      configParameter._inner.children.forEach(c => {
        schemaJoiPropertyValidation(c.key, c.schema, param);
      });
    }
  }

  if(schema.type == "object"){
    schema["properties"][name] = param;
  }
  else{
    schema[name] = param;
  }

}

function formatJoiPropertyValidation(place, configParameter){
  var param = {
    "required": configParameter._flags.presence == "required" ? true : false,
    "type": configParameter._type
  };

  switch(place){
    case "files":
      param["type"] = "file";
      break;
    default:
      param["type"] = configParameter._type;
      break;
  }

  if(configParameter._description){
    param["description"] = configParameter._description;
  }

  // default
  if(typeof configParameter._flags.default != "undefined"){
    param.default = configParameter._flags.default;
  }

  // allowEmptyValue
  if(place != "params"){
    param.allowEmptyValue = !configParameter._invalids._set.some(v => { return ['', null].indexOf(v) > -1; });
  }

  // enum
  if(configParameter._flags.allowOnly && configParameter._valids._set.length){
    param.enum = configParameter._valids._set;
  }

  // array items
  if(param.type == "array"){

    // schema item
    if(configParameter._inner && configParameter._inner.items && configParameter._inner.items[0]){
      param["items"] = {
        type: getType(configParameter._inner.items[0]._type)
      }
    }
    else{
      param["items"] = {
        type: getType("any")
      }
    }

  }

  // tests
  configParameter._tests.forEach( test => {
    switch(test.name){
      case "min":
        param.minimum = test.arg;
        break;
      case "max":
        param.maximum = test.arg;
        break;
      default:
        break;
    }
  });

  // unit
  if(configParameter._unit){
    param.description += (param.description ? " " : "") + "("+configParameter._unit+")";
  }

  return param;
}

function formatResponses(routeResponses){
  // format responses
  var responses = {};

  Object.keys(routeResponses).forEach(
    p => {
      responses[p] = routeResponses[p];
    }
  );

  // if none
  if(!Object.keys(responses).length){
    responses.default = {
      "description": "none"
    };
  }

  return responses;
}

function getType(type){
  return type == "any" ? "object" : type;
}
