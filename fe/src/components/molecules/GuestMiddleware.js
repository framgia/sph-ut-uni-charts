import React, { useState, useEffect, Fragment } from 'react'
import Router from 'next/router'

import { checkActiveStatus } from '../../services/authService'
import Loader from './Loader'

const GuestMiddleware = ({ children }) => {
  const [fetching, setFetching] = useState(true)
  const disableAuthentication = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'

  const loadStatus = async () => {
    if (disableAuthentication) return setFetching(false)
    const result = await checkActiveStatus()

    if (result) Router.push('/')
    else setFetching(false)
  }

  useEffect(() => {
    loadStatus()
  })

  return fetching ? <Loader /> : <Fragment>{children}</Fragment>
}

export default GuestMiddleware
