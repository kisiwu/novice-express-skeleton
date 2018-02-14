var path = require('path');

module.exports = function ParameterBag(config, novice){

    config = config && typeof config === "object" ? config : {};

    var parameters = {};

    var resolved = false;

    var instance = this;

var resolve = function(value, key){

    if(!(typeof value === "string")){
        return value;
    }

    var escapedValue = value.replace(/%%|%([^%\s]+)%/g, function(match, contents, offset, s)
    {
        //skip %%
        if(typeof contents === "undefined"){
            return "%%";
        }

        if(contents === key){
            throw new Error(
                'Circular reference in parameter "'+key+'" of value "'+value+'".'
                );
        }

        var param = instance.get(contents);

        if (typeof param === "string" || typeof param === "number") {
            return param.toString();
        }
        else{
            throw new Error(
                'A string value must be composed of strings and/or numbers,'+
                'but found parameter "'+contents+'" of type '+ typeof param +' inside string value "'+value+'".'
                );
        }
    });

    return escapedValue.replace(/%%/g, "%");
}

    this.resolve = resolve;

    this.resolveAll = function(){
        if(resolved){
            return;
        }

        for(var p in parameters){
            this.set(p, resolve(parameters[p], p));
        }

        for(var p in config){
            this.set(p, resolve(config[p], p));
        }

        resolved = true;
    }

    this.set = function(name, service){
        parameters[name] = service;
    }

    this.get = function(name){
        if(typeof parameters[name] === "undefined"){
            if(typeof config[name] === "undefined"){
                return config[name];
            }
            else{
                this.set(name, resolve(config[name], name));
            }
        }
        else{
        }

        return parameters[name];
    }
};