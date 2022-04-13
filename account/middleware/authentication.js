require('dotenv').config()
const jwt = require('jsonwebtoken')
const tokenKey = process.env.TOKEN_KEY

module.exports.createAccessToken = (params) => {
  const data = {
    id: params.id,
    email: params.email
  }

  return jwt.sign(data, tokenKey, {})
}
