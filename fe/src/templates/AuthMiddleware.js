import React, { useState, useEffect, Fragment } from 'react'
import Router from 'next/router'

import { checkActiveStatus, clearData } from '../services/authService'
import Routes from '../const/routes.json'
import Loader from '../components/molecules/Loader'

const AuthMiddleware = ({ children }) => {
  const [fetching, setFetching] = useState(true)
  const disableAuthentication = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'

  const loadStatus = async () => {
    if (disableAuthentication) return setFetching(false)

    const isGuestPage = Routes.guest.includes(Router.pathname)
    const activeUser = await checkActiveStatus()

    if (isGuestPage && activeUser) {
      return Router.push('/')
    }

    if (!isGuestPage && !activeUser) {
      clearData()
      return Router.push('/login')
    }

    setFetching(false)
  }

  useEffect(() => {
    loadStatus()
  })

  return fetching ? <Loader /> : <Fragment>{children}</Fragment>
}

export default AuthMiddleware
