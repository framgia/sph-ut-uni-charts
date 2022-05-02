import React from 'react'
import { GoogleLogin } from 'react-google-login'
import Head from 'next/head'
import { Button, Container, Group, Pagination, Select, Table, Text, TextInput } from '@mantine/core'

import { loginUser } from '../../services/authService'
import Router from 'next/router'
import GuestMiddleware from '../../components/molecules/GuestMiddleware'

const Login = (props) => {
  const handleLogin = async (params) => {
    if (!params?.tokenId) return
    await loginUser(params)

    Router.push('/')
  }

  return (
    <GuestMiddleware>
      <Container>
        <Head>
          <title>Login</title>
        </Head>

        <main>
          <Text color="blue">
            <h1>Welcome to Uni Chart!</h1>
          </Text>

          <GoogleLogin
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
            buttonText="Sign in with Google"
            onSuccess={handleLogin}
            onFailure={handleLogin}
            cookiePolicy={'single_host_origin'}
          />
        </main>
      </Container>
    </GuestMiddleware>
  )
}

export default Login
