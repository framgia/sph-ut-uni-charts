import React from 'react'
import { GoogleLogin } from 'react-google-login'
import { Center } from '@mantine/core'

import Router from 'next/router'
import Cookies from 'js-cookie'
import { login } from '@/src/api/authApi'
import { baseAuthApi } from '@/src/api/base'

const Login = (props) => {
  const handleLogin = async (params) => {
    if (!params?.tokenId) return

    const payload = {
      email: params?.profileObj?.email,
      google_id: params?.profileObj?.googleId,
      token_id: params?.tokenId,
    }

    await login(payload)

    baseAuthApi.defaults.headers.Authorization = payload.email
    Cookies.set('user_signed', JSON.stringify({ ...payload }))
    Router.push('/')
  }

  return (
    <Center sx={{ height: '80vh' }}>
      <GoogleLogin
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        buttonText='Sign in with Google'
        onSuccess={handleLogin}
        onFailure={handleLogin}
        cookiePolicy={'single_host_origin'}
      />
    </Center>
  )
}

export default Login
