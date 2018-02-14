/**
* Use express Router
* rewrite its 'route' method
*/

var Route = require('express/lib/router/route');
var Layer = require('express/lib/router/layer');

var expressRouter = require('express').Router;

// rewrite route method (polymorphism)
expressRouter.route = function route(path) {
  var meta = {};

  // if path argument is an object, get property 'path'
  if(path && typeof path === 'object'){
    Object.keys(path).forEach(p => {
      switch(p){
        case 'path':
          break;
        case 'stacks':
          if(!meta.stacks){
            meta[p] = [];
          }
          var pStacks = path[p];
          if(!Array.isArray(pStacks)){
            pStacks = [pStacks];
          }

          pStacks.forEach(s => {
            if(typeof s === 'string'){
              meta[p].push(s)
            }
          });
          break;
        default:
          meta[p] = path[p];
          break;
      }
    });

    path = path.path;
  }

  // initialize route
  var route = new Route(path);
  route.meta = meta;

  // initialize layer
  var layer = new Layer(path, {
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  }, route.dispatch.bind(route));

  layer.route = route;

  this.stack.push(layer);
  return route;
};

module.exports = expressRouter;
