// .service/lib/managers/sequelize_manager.js
var path = require('path');

module.exports = function SequelizeManager(name, database, username, password, options, modelsDir){

    var Sequelize = require('sequelize');

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
                    if(model && typeof model === "object" && model.dogma.trim() == "sequelize"){
                        var validName = typeof model.modelName === "string";
                        var validSchema = model.schema && typeof model.schema === "object";

                        var isValid = validName && validSchema;
                        if(isValid){
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
      return "sequelize";
  }

  this.getConnectionName = function (){
     return name;
  }
  
  this.createConnection = function (){
      console.log("Sequelize: create connection "+ name);
     connection = new Sequelize(database, username, password, options);

     for(var key in schemas){
          models[key] = connection.define(schemas[key].modelName, schemas[key].schema, schemas[key].options);
      }

      return connection
  }
  
  this.getConnection = function (){
      if (typeof connection == "undefined") {
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

  this.getModel = function(filename){
      return models[key];
  }

  this.getModels = function (){
	 return models;
  }
  
  this.disconnectAll = function (){
	  mongoose.disconnect();
  }

};