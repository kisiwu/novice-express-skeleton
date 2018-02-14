var Novice = require('novice');
var Joi = require('joi');
var ValidatorJoi = Novice.require('utils/validator-joi');

var fs = require('fs');
var fileType = require('file-type');
var readChunk = require('read-chunk');

// 206 Partial Content
Novice.route({
	name: 'File',
	stacks: ['Media'],
	path: '/media/:id',
	validator: ValidatorJoi,
	validate: {
		params: {
			id: Joi.string()
				.required()
				.description('Filename')
		}
	}
},
function(req, res, next) {
	var stream;
	var file = "./private/" + req.params.id;
	
	Novice.logger.info(file);

	try{
		fs.stat(file, function(err, stat) {
			if(err == null) {
				if(stat.isFile()){
					// is a file

					var total = stat.size;
					var range = req.headers.range;

					var start = 0;
					var end = total - 1;
					var chunksize = (end - start) + 1;

					var responseCode = 200;
					if (range) {
						responseCode = 206;
						Novice.logger.info(`[Media] headers range="${req.headers.range}"`);
						var positions = range.replace(/bytes=/, "").split("-");
      			start = parseInt(positions[0], 10);
      			end = positions[1] ? parseInt(positions[1], 10) : total - 1;
      			chunksize = (end - start) + 1;
					}
					else{
						//return res.reply(406)
					}

					var head = {
						"Accept-Ranges": "bytes",
						"Content-Range": "bytes " + start + "-" + end + "/" + total,
						'Content-Length': chunksize,
						'Content-Type': 'video/mp4',
					};

					// get file MIMEType for 'Content-Type'
					readChunk(file, 0, 4100).then(
						buffer => {
							var type = fileType(buffer);
							if(type){
								head['Content-Type'] = type.mime || head['Content-Type'];
								Novice.logger.info(`Reading ${type.ext} file`);
							}

							// if video, keep connection alive
							if(
								head['Content-Type']
								&& (
										head['Content-Type'].indexOf("video") == 0
										|| head['Content-Type'].indexOf("audio") == 0
									)
							){
								if(!range){
									Novice.logger.info("Missing range:", range);
									return res.reply(406);
								}
									

								/**
								* The Connection general header controls
								* whether or not the network connection
								* stays open after the current transaction finishes.
								* If the value sent is keep-alive, the connection is
								* persistent and not closed, allowing for subsequent
								* requests to the same server to be done.
								*/
								head['Connection'] = "keep-alive";
								Novice.logger.info(`Connection: "${head['Connection']}"`);
							}

							/** send headers
							*
							* The HTTP 206 Partial Content success status
							* response code indicates that the request has
							* succeeded and has the body contains the requested
							* ranges of data, as described in the Range header
							* of the request.
							*/
							res.writeHead(responseCode, head);

							// stream response
							stream = fs.createReadStream(file, {
								flags: "r",
								start: start,
								end: end + 1
							});

							//stream.pipe(res);
							stream.on("open", function() {
		          	stream.pipe(res);
		        	}).on("error", function(err) {
		          	res.end(err);
		        	});
						}
					)
					.catch(next)
				}
				else{
					// is not a file
					res.reply(404);
				}
			} else if(err.code == 'ENOENT') {
				// file does not exist
				res.reply(404);
			} else {
				// other error
				next(err);
			}
		});
	}catch(e){
		next(e)
	}
});
