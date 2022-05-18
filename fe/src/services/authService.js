import Cookies from 'js-cookie'

import { login, logout, checkStatus } from '../api/authApi'

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
  clearData()
}

export const clearData = () => {
  Cookies.remove('user_signed')
}

export const profile =
  Cookies.get('user_signed') && JSON.parse(Cookies.get('user_signed'))
