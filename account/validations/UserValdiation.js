const validator = require('node-validator')

module.exports.signIn = (data) => {
  let validationErrors = null
  const validations = validator
    .isObject()
    .withRequired(
      'email',
      validator.isString({
        regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        message: 'The email value is invalid.'
      })
    )
    .withRequired('token_id', validator.isString())
    .withRequired('google_id', validator.isString())

  validator.run(validations, data, (errorCount, errors) => {
    if (errorCount > 0) validationErrors = errors
  })

  return validationErrors
}

module.exports.checkAuthenticated = (data) => {
  let validationErrors = null
  const validations = validator.isObject().withRequired(
    'email',
    validator.isString({
      regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      message: 'The email value is invalid.'
    })
  )

  validator.run(validations, data, (errorCount, errors) => {
    if (errorCount > 0) validationErrors = errors
  })

  return validationErrors
}

module.exports.signOut = (data) => {
  let validationErrors = null
  const validations = validator
    .isObject()
    .withRequired(
      'email',
      validator.isString({
        regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        message: 'The email value is invalid.'
      })
    )
    .withRequired('token_id', validator.isString())

  validator.run(validations, data, (errorCount, errors) => {
    if (errorCount > 0) validationErrors = errors
  })

  return validationErrors
}

module.exports.show = (data) => {
  let validationErrors = null
  const validations = validator.isObject().withRequired(
    'email',
    validator.isString({
      regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      message: 'The email value is invalid.'
    })
  )

  validator.run(validations, data, (errorCount, errors) => {
    if (errorCount > 0) validationErrors = errors
  })

  return validationErrors
}
