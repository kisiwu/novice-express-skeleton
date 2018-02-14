var p = {
	parameters: {
		"db.type": "mongoose",
		"db.database": 'mongodb://path-to-db',
		"db.models_dir": "%novice.project_dir%/models",
		"app.utils_dir": "%novice.project_dir%/utils",
		"secret_key": "its-a-secret",
		"crypto_salt": "abcdefghijklmnop",

	   /** the example below throws an error (circular reference)
		*  "circular_ref" referencing itself
		*/
		//"circular_ref": "throw error %circular_ref%", 
	}
};

module.exports = p;
