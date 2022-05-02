import { render, screen } from '@testing-library/react'
import { Fragment } from 'react'

import Login from '@/src/pages/login'

jest.mock('../src/components/molecules/GuestMiddleware', () => ({ children }) => {
  const isStatusActive = false
  if (isStatusActive) Router.push('/')

  return <Fragment>{children}</Fragment>
})

describe('Login.js', () => {
  it('should render login page when user is not authenticated', () => {
    render(<Login />)

    const hasHeading = screen.getByRole('heading', {
      name: /welcome to uni chart/i
    })
    const hasGoogleButton = screen.getByRole('button', {
      span: /Sign in with Google/i
    })

    expect(hasHeading).toBeInTheDocument()
    expect(hasGoogleButton).toBeInTheDocument()
  })
})
