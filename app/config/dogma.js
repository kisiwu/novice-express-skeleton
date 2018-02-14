/**
* Each services can be register in registered in different files.
* For example, this file is used to register one service (dogma)
*/

var s = {
	services: {
		/**
		"dogma": {
			type: "factory",
			indexPath: "%novice.service_dir%/dogma.factory",
			arguments: {
				"novice_express": {
						type: "%db.type%",
						database: '%db.database%',
						options: {
							replset: {
								socketOptions : {
									keepAlive : 1
								}
							},
							server : {
								poolSize: 24,
								socketOptions : {
									keepAlive : 120
								}
							}
						},
						modelsDir: "%db.models_dir%/dogma/mongoose",
						promise: "Promise"//"bluebird"
				}
			}
		}
		*/
	}
};

module.exports = s;
