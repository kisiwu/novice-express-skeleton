// .service/lib/registry.js

var path = require('path');

module.exports = function Registry(managers){ //ex: {"novicedb": MongooseManager{}, "retro": SequelizeManager{}, ...}

    var defaultName = Object.keys(managers)[0] || "default";

  this.getDefaultConnectionName = function (){
     return defaultName;
  }
  
  this.getConnection = function (name){
      if(typeof name === "undefined"){
          return this.getDefaultConnection();
      }

     return managers[name].getConnection();
  }

  this.getDefaultConnection = function(){
      var name = this.getDefaultConnectionName();
     return managers[name].getConnection();
  }

  this.closeConnection = function (name){
      if(typeof name === "undefined"){
          return this.closeDefaultConnection();
      }
      managers[name].closeConnection();
  }

  this.closeDefaultConnection = function (){
      var name = this.getDefaultConnectionName();
	  managers[name].closeConnection();
  }
  
  this.close = function (name){
	  this.closeConnection(name);
  }

  this.getManager = function(name){
      if(typeof name === "undefined"){
          return this.getDefaultManager();
      }

     return managers[name];
  }

  this.getDefaultManager = function(){
      var name = this.getDefaultConnectionName();
     return managers[name];
  }

  this.getModel = function(connectionName, filename){
      var name = "";
      var filePath = "";
      if(filename){
          name = connectionName;
          filePath = filename;
      }
      else{
          //getDefaultConnectionName
          var arr = connectionName.split(":");
          if(arr.length == 2){
              name = arr[0];
              filePath = arr[1];
          }
          else{
              filePath = connectionName;
              name = this.getDefaultConnectionName();
          }
      }

      return managers[name].getModel(filePath);
  }

  this.getModels = function(name){
      if(typeof name === "undefined"){
          name = this.getDefaultConnectionName();
      }

      return managers[name].getModels();
  }

};