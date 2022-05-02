const axios = require('axios')
const Cookies = require('js-cookie')

const TOKEN = Cookies.get('token_id')

const root = 'http://localhost:11000/api/'

const base = axios.create({
  baseURL: `${root}`,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default base
