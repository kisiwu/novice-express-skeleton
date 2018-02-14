var path = require('path');

module.exports = function ServiceBag(config, novice){

    config = config && typeof config === "object" ? config : {};

    var services = {};

    const AUTH_TYPES = ["service", "factory", "class"];

var resolveStringArguments = function(args){
    /*
    if(!Array.isArray(args)){
        return args;
    }
    */

    for(var i = 0; i < args.length ; i++){
        if(Array.isArray(args[i])){
            args[i] = resolveArguments(args[i]);
        }

        if(args[i] && typeof args[i] === "string"){
            args[i] = novice.parameterBag.resolve(args[i]);
        }
    }

    return args;
};

var buildService = function(key, configKey){
    var name = typeof configKey.name === "string" && configKey.name.trim() != "" ? configKey.name : key;
    var indexPath = novice.parameterBag.resolve(configKey.indexPath) || path.join(novice.getParameter('novice.service_dir'), key);
    var args = configKey.arguments || [];

    if(!Array.isArray(args)){
        args = [args];
    }

    args.push(novice);

    args = resolveStringArguments(args);


    var type = configKey.type || "service";

    var filePath = indexPath;

    switch(type){
        case "service":
        // just use the module as service
            return require(filePath);
        break;
        case "factory":
        // call the module that returns the service
            return require(filePath).apply(filePath, args);
        break;
        case "class":
        // instanciate the module and use the new object as service
            var ClassFile = require(filePath);
            args.unshift(ClassFile);
            return new (ClassFile.bind.apply(ClassFile,args));
        break;
        default:
            var message = "Cannot build service \""+ name +"\". Authorized type attribute values are: "+AUTH_TYPES.toString()+".";
            throw new Error(message);
        break;
    }    
}

    this.set = function(name, service){
        services[name] = service;
    }

    this.get = function(name){
        if(typeof services[name] === "undefined"){
            if(typeof config[name] === "undefined"){
                return config[name];
            }
            else{
                this.set(name, buildService(name, config[name]));
            }
        }
        else{
        }
        return services[name];
    }

    this.getServiceIds = function(){
        var array1 = Object.keys(config);
        var array2 = Object.keys(services);

        var array = array1.concat(array2);

        var a = array.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j]){
                    a.splice(j--, 1);
                }
            }
        }

        return a;
    }
};