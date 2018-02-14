// lib/novice-www-debug.js
var path = require('path');

module.exports = function (appName, noviceParams) {
		var appNamespace = "";
		if(appName !== undefined){
			appNamespace = appName;
		}
		else{
			if(noviceParams !== undefined){
				appNamespace = path.basename(noviceParams.getProjectRoot());
			}
			else{
				appNamespace = path.basename(require('novice-parameters').getProjectRoot());
			}
		}

		var debug = require('debug')(appNamespace+':server');

		return debug;
};