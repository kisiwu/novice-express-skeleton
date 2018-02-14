var Novice = require('novice');
var Joi = require('joi');
var ValidatorJoi = Novice.require('utils/validator-joi');

var url = require('url');

Novice.route({
	name: 'Novice Web Video Player',
	stacks: ['Media'],
	path: '/media/videoplayer'
},
ValidatorJoi({
  query: {
		v: Joi.string()
    .description('video url')
    .default("https://scontent-bru2-1.cdninstagram.com/t50.2886-16/22309529_2021577694738894_8680661914952400896_n.mp4"),
		p: Joi.string()
    .description('poster')
		.default('http://2b0wpkmru4s14hvp7xrlrqxp.wpengine.netdna-cdn.com/wp-content/uploads/2015/10/17tips_cover.png')
  }
}),
function(req, res, next) {

  /** handler to get the non decoded url query
  *
  * PROBLEM: the query values were always url decoded ('%2' => '+')
  * and in this case, it should not be because the query represent an url used to
  * get the remote file and that url should not be changed
  *
  * TODO: not yet optimised for many url queries
  *
  */
  function getNoNDecodedQueryValue(key, fromString){
    // get the non parsed query string
    var query = url.parse(req.url).query

    var nonDecodedQueryValue;

		if(fromString && req.query[key] && query && query.indexOf(key+"=") > -1){
			nonDecodedQueryValue = query.substring(query.indexOf(key+"=") + 2);
			if(key == 'v'){
				var nextQueryPos = nonDecodedQueryValue.indexOf("&p=");
				if(nextQueryPos > -1){
					nonDecodedQueryValue = nonDecodedQueryValue.substring(0, nextQueryPos);
				}
			}
		}
		else {
			nonDecodedQueryValue = req.query[key]
		}

    return nonDecodedQueryValue;
  }

	return res.render('media/videoplayer', {
		v: getNoNDecodedQueryValue("v", true),
		p: getNoNDecodedQueryValue("p")
	});
});
