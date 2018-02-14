/**
* Services register
*/

var s = {
	services: {
		// class
		"class.service.test": {
			type: "class",
			arguments : [
				4,
				6,

				"%secret_key%",
				"%db.type%",
				'%db.database%',
				"%novice.service_dir%",
			]
		},
		// factory
		"Crypto64":{
			type: "factory",
			indexPath: "%novice.service_dir%/crypto64.service/crypto64",
			arguments: {
				secretKey: "%secret_key%",
				"salt": "%crypto_salt%"
			}
		},
		// simple file
		"sha256":{
			indexPath: "crypto-js/sha256"
		},
	}
};

module.exports = s;
