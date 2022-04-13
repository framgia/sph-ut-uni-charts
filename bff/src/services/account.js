require('dotenv').config()
const axios = require('axios')
const URL = process.env.ACCOUNT_API_SERVICE

// get all data from Test table
module.exports.allTests = async () => {
  let data

  await axios({
    url: `${URL}/tests/all`,
    method: 'get'
  }).then((response) => {
    data = response.data
  })

  return data
}

// login user
module.exports.login = async (params) => {
  let data

  await axios
    .post(`${URL}/users/login`, {
      email: params.email,
      password: params.password
    })
    .then((response) => {
      data = response.data
    })
    .catch((error) => {
      console.log(error)
    })

  return data
}

// register user
module.exports.register = async (params) => {
  let data

  await axios
    .post(`${URL}/users/register`, {
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      password: params.password
    })
    .then((response) => {
      data = response.data
    })
    .catch((error) => {
      console.log(error)
    })

  return data
}
