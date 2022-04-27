const axios = require('axios')
const URL = process.env.BACKLOG_API_SERVICE

class Backlog {
  static async allTests() {
    let data

    await axios({
      url: `${URL}/tests/all`,
      method: 'get'
    }).then((response) => {
      data = response.data
    })

    return data
  }

  static async add(payload) {
    return await axios
      .post(`${URL}/providers/add`, { ...payload })
      .then((response) => {
        return response
      })
      .catch((error) => {
        return error.response
      })
  }
}

module.exports = Backlog
