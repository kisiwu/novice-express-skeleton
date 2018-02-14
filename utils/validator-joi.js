// ref: npm express-joi-validator

var Joi = require('joi');
var Extend = require('extend');

module.exports = function validate(schema, options) {
  options = options || { stripUnknown: true };

  return function validateRequest(req, res, next) {
    var toValidate = {};

    if (!schema) {
      return next();
    }

    ['params', 'body', 'query'].forEach(function (key) {
      if (schema[key]) {
        toValidate[key] = req[key];
      }
    });

    return Joi.validate(toValidate, schema, options, onValidationComplete);

    function onValidationComplete(err, validated) {
      if (err) {
        //return next(Boom.badRequest(err.message, err.details));
        return res.status(400).json(err);
      }

      // copy the validated data to the req object
      Extend(req, validated);

      return next();
    }
  }
};
