// lib/parameters.js
var path = require('path');

module.exports = {
	
	services: {},

	appRoot: undefined,
	projectRoot: undefined,
	configDir: undefined,
	
	getProjectRoot: function () {
		if (this.projectRoot != undefined)
		{
			return this.projectRoot;
		}
		var projectRootPath = path.dirname(require.main.filename);
		if((projectRootPath.length - 4) === projectRootPath.indexOf(path.sep + 'bin') || (projectRootPath.length - 4) === projectRootPath.indexOf(path.sep + 'app'))
			projectRootPath = projectRootPath.slice(0, -4);
		
		return projectRootPath;
	},

	getAppRoot: function () {
		if (this.appRoot != undefined)
		{
			return this.appRoot;
		}
		var appRootPath = path.dirname(require.main.filename);		
		return appRootPath;
	},
	
	getConfigDir: function () {
		if (this.configDir != undefined)
		{
			return this.configDir;
		}
		
		return path.join(this.getAppRoot(), "config");
	}
};