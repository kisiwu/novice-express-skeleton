var Logger = require('../../../../logger');
var color = require('../../../../logger/lib/color');
var NoviceRoutingClass = require('../../index.js');


exports = module.exports = Log;

function Log(){
}

Log.prototype.format = function format(){}

Log.prototype.add = function add(route){
  // stacks (tags), name, description, path, method, parameters

  var routeStacks = route.stacks.join(", ");

  //Logger.log(route.parameters);

  Logger.log( `\n
\t${routeStacks}
\t╔═══════${route.method.length >= 4 ? "═".repeat(route.method.length - 3) : ""}═╤═════${route.path.length >= 6 ? "═".repeat(route.path.length - 4) : ""}═╤═══════${route.name && route.name.length > 7  ? "═".repeat(route.name.length-7) : ""}══╗
\t║ Method${route.method.length >= 4 ? " ".repeat(route.method.length - 3) : ""} │ Path${route.path.length >= 6 ? " ".repeat(route.path.length - 4) : ""} │ Name  ${route.name && route.name.length > 7  ? " ".repeat(route.name.length-7) : ""}  ║
\t╟───────${route.method.length >= 4 ? "─".repeat(route.method.length - 3) : ""}─┼─────${route.path.length >= 6 ? "─".repeat(route.path.length - 4) : ""}─┼───────${route.name && route.name.length > 7  ? "─".repeat(route.name.length-7) : ""}──╢
\t║ ${NoviceRoutingClass.logFormatMethod(route.method)}    │ ${route.path} ${route.path.length <= 4 ? " ".repeat(4-route.path.length) : ""}│ ${route.name ? color("FGMAGENTA", route.name) : " ".repeat(7)} ${route.name && route.name.length <= 7  ? " ".repeat(7-route.name.length) : ""}║
\t╚═══════${route.method.length >= 4 ? "═".repeat(route.method.length - 3) : ""}═╧═════${route.path.length >= 6 ? "═".repeat(route.path.length - 4) : ""}═╧═══════${route.name && route.name.length > 7  ? "═".repeat(route.name.length-7) : ""}══╝
\t${route.description}
\n` );

}
