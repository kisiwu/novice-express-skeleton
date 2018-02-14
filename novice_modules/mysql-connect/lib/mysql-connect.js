// lib/mysql-connect.js

module.exports = {
  mysql : require('mysql'),
  //conn : null,
 
  config: {},

  createConnection: function () {
    return this.mysql.createConnection(this.config);
  },

  createPool: function () {
    return this.mysql.createPool(this.config);
  },

  createPoolCluster: function () {
    return this.mysql.createPoolCluster(this.config);
  },

  /*handleError: function(connOrQuery, callback){
		var callbackError = function(err) {      
			callback(err);
			return;     
	    };
		connOrQuery.on('error', callbackError);
  },

  connect : function (callback) {
	var config = this.config;
    this.conn = this.mysql.createConnection(config);
	this.conn.connect(callback);
	return this;
  },
 
  close : function() {
    this.conn.end();
  },
 
  executeSelectQuery : function( selectQuery, callback ) {
	return this.conn.query( selectQuery, function (error, results, fields) {
			if (error) return;
 
	        callback(results, fields);
	});
  }*/
};