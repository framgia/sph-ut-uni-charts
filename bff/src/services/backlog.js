require('dotenv').config()
const axios = require('axios')
const URL = process.env.BACKLOG_API_SERVICE

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
