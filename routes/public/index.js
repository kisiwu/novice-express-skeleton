var Novice = require('novice'),
    Finder = Novice.require('utils/finder');

var files = Finder.dirs(__dirname);

var routers = files.map(function(file){
  return require(file);
});

module.exports = routers;
