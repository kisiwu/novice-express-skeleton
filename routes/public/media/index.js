var Novice = require('novice'),
    Finder = Novice.require('utils/finder');

var files = Finder.files(__dirname, '.js', __filename);

files.forEach(function(file){
  require(file);
});

module.exports = Novice.Router();
