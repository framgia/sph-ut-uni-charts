import Cookies from 'js-cookie'

import { login, logout, checkStatus } from '../api/authApi'

export const loginUser = async (params) => {
  const payload = {
    email: params?.profileObj?.email,
    google_id: params?.profileObj?.googleId,
    token_id: params?.tokenId
  }

  await login(payload)
  Cookies.set('user_signed', JSON.stringify({ ...payload }))
}

export const checkActiveStatus = async () => {
  const raw = Cookies.get('user_signed')
  if (!raw) return false

  const userData = JSON.parse(raw)
  if (!userData) return false

  try {
    await checkStatus(userData.email)
    return true
  } catch (error) {
    return false
  }
}

export const signOut = async () => {
  const raw = Cookies.get('user_signed')
  if (!raw) return false

  const userData = JSON.parse(raw)
  if (!userData) return false

  const { google_id, ...payload } = userData
  await logout(payload)
  Cookies.remove('user_signed')
}

export const profile = Cookies.get('user_signed') && JSON.parse(Cookies.get('user_signed'))
