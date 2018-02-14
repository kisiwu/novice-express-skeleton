var path = require('path');
var Registry = require("./lib/registry");

var MongooseManager = require("./lib/managers/mongoose_manager");
var SequelizeManager = require("./lib/managers/sequelize_manager");

/*module.exports = function DBService(args, novice){

    //var config = {};

    for(var conn in args){
        var obj = args[conn];

        obj.type = novice.parameterBag.resolve(obj.type || "mongoose");
        obj.database = novice.parameterBag.resolve(obj.database);
        obj.modelsDir = novice.parameterBag.resolve(obj.modelsDir || "%novice.project_dir%/models");

        if(obj.type != "mongoose"){
            throw new Error("attibute \"type\": value \""+ obj.type + "\" is not supported !");
        }
    }

    return new Registry(args);

}*/

module.exports = function RegistryFactory(args, novice){

    //console.log(args);

    var managers = {};

    for(var name in args){
        var obj = args[name];

        obj.type = novice.parameterBag.resolve(obj.type || "mongoose");
        obj.database = novice.parameterBag.resolve(obj.database);
        obj.modelsDir = novice.parameterBag.resolve(obj.modelsDir || "%novice.project_dir%/models/"+obj.type);

        var manager;
        switch(obj.type){
            case "mongoose":
                obj.promise = obj.promise && typeof obj.promise === 'string' ?
                  novice.parameterBag.resolve(obj.promise) : obj.promise;
                manager = new MongooseManager(name, obj.database, obj.options || {}, obj.modelsDir, obj.promise );
            break;
            case "sequelize":
                obj.username = novice.parameterBag.resolve(obj.username || null);
                obj.password = novice.parameterBag.resolve(obj.password || null);

                manager = new SequelizeManager(name, obj.database, obj.username, obj.password, obj.options || {}, obj.modelsDir);

            break;
            default:
                throw new Error("attibute \"type\": value \""+ obj.type + "\" is not supported !");
            break;
        }

        managers[name] = manager;
    }

    return new Registry(managers);

}
