import { baseApi } from './base'

export const login = (payload) => {
  const options = {
    method: 'POST',
    url: '/account/sign-in',
    data: JSON.stringify(payload),
  }

  return baseApi.request(options)
}

export const checkStatus = (email) => {
  const options = {
    method: 'GET',
    url: '/account/active-status',
    params: { email },
  }

  return baseApi.request(options)
}

export const logout = (payload) => {
  const options = {
    method: 'POST',
    url: '/account/sign-out',
    data: JSON.stringify(payload),
  }

  return baseApi.request(options)
}
