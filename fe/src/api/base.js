const axios = require('axios')
const Cookies = require('js-cookie')

const user = JSON.parse(Cookies.get('user_signed') || '{}')

export const baseApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BFF_API}`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const baseAuthApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BFF_API}`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: user.email, // we will change this to token once we refactor the session
  },
})
