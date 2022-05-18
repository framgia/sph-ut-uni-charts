import Cookies from 'js-cookie'
import mockRouter from 'next-router-mock'
import { act } from 'react-dom/test-utils'
import { fireEvent, render, screen } from '@testing-library/react'

import Login from '@/src/pages/login'
import Router from 'next/router'
import { login } from '@/src/api/authApi'

jest.mock('next/router', () => require('next-router-mock'))
jest.mock('@/src/api/authApi')
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  set: jest.fn(),
  setMockImplementation: jest.fn(),
  remove: jest.fn(),
}))
jest.mock('react-google-login', () => {
  const defaultMockSuccess = {
    tokenId: 'tokenId',
  }
  const GoogleLogin = ({ onSuccess, buttonText }) => {
    const handleClick = () => {
      onSuccess(defaultMockSuccess)
    }
    return <button onClick={handleClick}>{buttonText}</button>
  }

  return { GoogleLogin }
})

describe('when rendering login page', () => {
  beforeEach(async () => {
    mockRouter.setCurrentUrl('/login')
  })

  describe('when using login function', () => {
    let googleButton, routerSpy

    beforeEach(async () => {
      await act(async () => render(<Login />))

      routerSpy = jest.spyOn(Router, 'push')
      googleButton = screen.getByRole('button', {
        span: /Sign in with Google/i,
      })
      login.mockImplementation(() => Promise.resolve())
    })

    it('should have login button', () => {
      expect(googleButton).toBeInTheDocument()
    })

    it('should call the "loginUser" function after google form is finished', async () => {
      await act(() => {
        fireEvent.click(googleButton)
      })
      expect(login).toHaveBeenCalledTimes(1)
    })

    it('should set a cookie after signing in', async () => {
      const cookieSpy = jest.spyOn(Cookies, 'set')
      expect(cookieSpy).toHaveBeenCalledTimes(1)
    })

    it('should redirect to home page after signing in', () => {
      expect(routerSpy).toHaveBeenCalledTimes(1)
      expect(routerSpy).toHaveBeenCalledWith('/')
    })
  })
})
