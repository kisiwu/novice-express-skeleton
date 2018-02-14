/** PROTOTYPES FOR JAVASCRIPT CLASSES */
var path = require('path');

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

/** /PROTOTYPES FOR JAVASCRIPT CLASSES */

var novice = {
	novice: {
		/**
		 * The file where the routing is (*)(required)
		 */
		router: "routing",

		/**
		 * The cors configuration (npm: cors)
		 */
		cors: {
			"origin": "*",
			"methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
			"preflightContinue": false,
			"allowedHeaders": ['Content-Type', 'Authorization', 'From'],
			"privatePaths": ['^/info'],
			"blacklist": ["http://localhost:8024"]
		},

		/**
		 * The authorisation config route is registered via Novice (Novie.route(...)) and {auth: true}.
		 * Search for JWT token and decode token (default: req.auth, change it in property expressJwtOptions)
		 * properties: afterHandler, expressJwtOptions
		 */
		auth: {
			/**
			 * Handler after the token has been decoded and put in req.auth
			 */
			afterHandler: function(req, res, next){
				next();
			},

			/**
		 	 * The jwt configuration (npm: express-jwt)
		 	 */
			expressJwtOptions: {
				secret: "shhhhhhh"
			}
		},

		view: {
			/**
			 * The view engine (if not set, novice uses 'pug' by default if pug installed)
			 */
			engine: "pug"
		},
	
	/**
	* add default locals in response app.custom (e.g.: res.app.custom.myVarialble)
	*/
    locals: {
       __dependencies: []
    },

    docFormats: {
      /**
       * documentation formats to build
       */
      // true or false
      log: false,

      // true or path or false
      swagger: "/doc/swagger"
    },
	/* favicon in public folder */
	favicon: "favicon.ico"
	}
};

module.exports = novice;
