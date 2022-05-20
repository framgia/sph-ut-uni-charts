// @ts-nocheck
var validator = require('node-validator')
class ProviderValidation {
  static add = (data) => {
    let validationErrors

    var check = validator
      .isObject()
      .withRequired('user_id', validator.isNumber())
      .withRequired('name', validator.isString())
      .withRequired('project_id', validator.isNumber())
      .withOptional('api_key', validator.isString())
      .withOptional('id', validator.isNumber())

    validator.run(check, data, function (errorCount, errors) {
      if (errorCount) validationErrors = errors
    })

    return validationErrors
  }

  static getList = (data) => {
    let validationErrors

    var check = validator.isObject().withRequired('user_id', validator.isNumber())

    validator.run(check, data, function (errorCount, errors) {
      if (errorCount) validationErrors = errors
    })

    return validationErrors
  }
}

export default ProviderValidation
