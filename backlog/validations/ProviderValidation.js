var validator = require('node-validator')

class ProviderValidation {
  static add = (data) => {
    let validationErrors

    var check = validator
      .isObject()
      .withRequired('user_id', validator.isNumber())
      .withRequired('provider', validator.isString())
      .withRequired('space_key', validator.isString())
      .withRequired('api_key', validator.isString())
      .withRequired('project_key', validator.isString())
      .withRequired('project_name', validator.isString())
      .withRequired('project_id', validator.isNumber())

    validator.run(check, data, function (errorCount, errors) {
      if (errorCount) validationErrors = errors
    })

    return validationErrors
  }
}

module.exports = ProviderValidation
