import Router from 'next/router'
import React from 'react'
import { Button, Container, Text } from '@mantine/core'

import style from './Navbar.module.css'

import { signOut } from '../../../services/authService'

const Navbar = () => {
  const logoutOnClick = async () => {
    await signOut()
    Router.push('/login')
  }

  return (
    <Container className={style.container} float="right">
      <Button onClick={logoutOnClick}>Logout</Button>
    </Container>
  )
}

export default Navbar
