// .service/lib/managers/mongoose_manager.js
var path = require('path');

const WRAPPERS = {
  aggregation: require('../wrappers/aggregation')
}

module.exports = function MongooseManager(name, database, options, modelsDir, promiseLib){

    var mongoose = require('mongoose');

    // promise library
    if(promiseLib){
      if(typeof promiseLib === 'string'){
        if(promiseLib === 'Promise')
          mongoose.Promise = Promise;
        else
          mongoose.Promise = require(promiseLib);
      }
      else{
        mongoose.Promise = promiseLib;
      }
    }

    var connection;

    var models = {};

    var schemas = {};

    const fs = require('fs');

    var lookForModels = function(dir){

        var files = fs.readdirSync(dir);

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var filePath = path.join( dir, file );

            var stat = fs.statSync( filePath);

            if( stat.isFile() ){
                    if(!file.toLowerCase().endsWith(".js")){
                        continue;
                    }

                    var model = require(filePath);
                    if(model && typeof model === "object" && (!model.dogma || model.dogma.trim() == "mongoose")){
                        var validName = typeof model.modelName === "string";
                        var validSchema = model.schema && typeof model.schema === "object" && model.schema instanceof mongoose.Schema;

                        var isValid = validName && validSchema;
                        if(isValid){
                            //console.log(file);
                            //console.log("IS VALID");
                            schemas[model.modelName] = model;
                        }
                    }
                }
                else if( stat.isDirectory() ){
                    lookForModels(filePath);
                }
        }
    }

    lookForModels(modelsDir);


  this.getType = function(){
      return "mongoose";
  }

  this.getConnectionName = function (){
     return name;
  }

  this.createConnection = function (){
      console.log("Mongoose: create connection "+ name);
      connection = mongoose.createConnection(database, options);

      for(var key in schemas){
          models[key] = connection.model(schemas[key].modelName, schemas[key].schema);

          // add wrapper methods
          models[key].aggregation = WRAPPERS.aggregation(models[key]);
      }

      return connection;
  }

  this.getConnection = function (){
      if (typeof connection == "undefined" || (connection.readyState != 1 && connection.readyState != 2)) {
          this.createConnection();
      }
	 return connection;
  }

  this.closeConnection = function (){
	  connection.close();
      console.log("close connection "+name);
      connection = undefined;
  }

  this.close = function (){
	  this.closeConnection();
  }

  this.getModel = function(key){
      this.getConnection();

      return models[key];
  }

  this.getModels = function (){
     this.getConnection();
	 return models;
  }

  this.disconnectAll = function (){
	  mongoose.disconnect();
  }


  /** utils **/

  this.toObjectId = function(value){
    try{
      value = mongoose.Types.ObjectId(value);
    }catch(e){}
    return value;
  }


};
