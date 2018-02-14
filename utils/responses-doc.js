function listResponses(item){

  var responses = {
		'200': {
			'description': "A list of solutions",
			"schema": {
				"type": "object",
				"properties": {
					"count": {
						"type": "integer"
					},
					"limit": {
						"type": "integer"
					},
					"page": {
						"type": "integer"
					},
					"docs": {
						"type": "array"
					}
				}
			}
		}
	};

  if(item && typeof item === "object"){
    responses['200']['schema']['properties']['docs']['items'] = {
      "type": "object",
      "properties": item
    };
  }

  return responses;

}


module.exports = {
  listResponses: listResponses
};
