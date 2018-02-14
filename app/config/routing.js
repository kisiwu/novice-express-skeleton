var RouteCollection = require("novice").routeCollectionClass();

/**
* the ways to register routes
*/

module.exports = {


    public: { 
		// file/folder with the routes (required)
		resource: "public",

		// prefix used by the routes (optional, default: '/')
		prefix: "/api/public"
	},

    //otherWay: new RouteCollection("/api/public", "public")
};
