import Router from 'next/router'
import React from 'react'
import { signOut } from '../../../services/authService'
import { Power } from 'tabler-icons-react'

const Logout = () => {
  const logoutOnClick = async () => {
    await signOut()
    Router.push('/login')
  }

  return Router.pathname !== '/login' ? (
    <Power
      onClick={logoutOnClick}
      style={{ cursor: 'pointer' }}
      data-testid='logout-btn'
    />
  ) : null
}

export default Logout
