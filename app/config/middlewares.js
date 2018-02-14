/**
* Default middlewares register
*
*/

var session = require('express-session'),
	logger = require('morgan'),
	fs = require('fs'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	expressValidator = require('express-validator'),
	assets = require('connect-assets'),
	Novice = require('novice');
//var passport = require('passport');

var accessLogStream = fs.createWriteStream(Novice.resolvePath('/access.log'), {flags: 'a'})

var middlewares = {
	novice: {
		middlewares: [

			logger('dev'),
			//logger('combined', {stream: accessLogStream}),
			bodyParser.json(),
			bodyParser.urlencoded({ extended: false }),
			expressValidator(),
			cookieParser(),
			session({ secret: 'keyboard cat', saveUninitialized: false, resave: false }),
			/*passport.initialize(),
			passport.session(),*/
			assets({
            	paths: [
	            	'public',
            	]
        	}),

		]
	}
};

module.exports = middlewares;
