var path = require('path');
var apm = require('app-module-path');

var PrettyError = require('pretty-error');
var pe = new PrettyError();

// To render exceptions thrown in non-promies code:
/*process.on('uncaughtException', function(error){
   console.log(pe.render(error));
   process.exit(1);
});*/

var InstanceExists = false;
var novice = null;

exports = module.exports = GetNovice;

function GetNovice (appRoot){

    if (!exports.InstanceExists()) {
        var projectRoot = path.join(__dirname, '..');
        var configDir = path.join(__dirname, 'config');
        var modulesDirName = "novice_modules";

        apm.addPath(path.join(projectRoot, modulesDirName));

        var noviceApp = require('novice');
        noviceApp.init();
        noviceApp.params.appRoot = appRoot;
        noviceApp.params.projectRoot = projectRoot;
        noviceApp.params.configDir = configDir;

        novice = noviceApp;
        InstanceExists = true;
    }

    return novice;
}

exports.InstanceExists = function () {return InstanceExists;}
