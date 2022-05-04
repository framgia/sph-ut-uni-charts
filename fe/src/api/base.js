const axios = require('axios')
const Cookies = require('js-cookie')

const base = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BFF_API}`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default base
