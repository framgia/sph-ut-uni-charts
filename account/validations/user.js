var validator = require('node-validator');

/**
 * email regex: https://www.w3resource.com/javascript/form/email-validation.php
 */
module.exports.signIn = (data) => {
  let validationErrors = null;
  const validations = validator.isObject()
    .withRequired('email', validator.isString({
      regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      message: 'The email value is invalid.'
    }))
    .withRequired('google_id', validator.isString())

  validator.run(validations, data, (errorCount, errors) => {
    if (errorCount > 0) validationErrors = errors;
  });

  return validationErrors;
}