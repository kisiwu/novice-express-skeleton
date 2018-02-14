// lib/mongodb-connect.js

var MongoClient = require('mongodb').MongoClient;

module.exports = {
  MongoClient : MongoClient,
  url : "",
  config : {},
 
  connect: function (p_url, p_options, callback){
	  var from = 0;
	  var url = this.url;
	  var options = this.config || {};
	  
	  if(typeof p_url == 'string'){
		  url = p_url;
		  from = 1;
	  }
	  
	  var args = Array.prototype.slice.call(arguments, from);
	  callback = typeof args[args.length - 1] == 'function' ? args.pop() : null;
      p_options = args.length ? args.shift() : null;
      p_options = p_options || {};
	  
	  
	  for(property in p_options)
	  {
		  options[property] = p_options[property];
	  }

	  return this.MongoClient.connect(url, options, callback);
  },

};