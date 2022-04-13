const AccountService = require('../services/account')

module.exports.login = async (req, res) => {
  const result = await AccountService.login({
    email: req.body.email,
    password: req.body.password
  })

  res.send(result)
}

module.exports.login = async (req, res) => {
  const result = await AccountService.login({
    email: req.body.email,
    password: req.body.password
  })

  res.send(result)
}

module.exports.register = async (req, res) => {
  const result = await AccountService.register({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  })

  res.send(result)
}
