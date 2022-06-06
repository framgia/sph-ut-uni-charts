import { fireEvent, render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import Router from 'next/router'
import Cookies from 'js-cookie'

import { getProjects } from '@/src/api/providerApi'
import { logout } from '@/src/api/authApi'
import Home from '@/src/pages/index'
import testData from '../constants/testData.json'
import Main from '@/src/templates/Main'

jest.mock('next/router', () => {
  return {
    route: '/',
    pathname: '',
    query: {
      filterProviderName: '',
      searchProvider: '',
      page: '',
    },
    push: jest.fn(),
  }
})
jest.mock('@/src/api/providerApi')
jest.mock('@/src/api/authApi')
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  setMockImplementation: jest.fn(),
  remove: jest.fn(),
}))

describe('when using logout function', () => {
  let logoutButton, routerSpy

  beforeEach(async () => {
    getProjects.mockImplementation(() => {
      return Promise.resolve().then(() => {
        return { data: testData.projects }
      })
    })

    Cookies.get.mockReturnValueOnce(
      JSON.stringify({
        user_signed: {
          email: 'joshua.escarilla@sun-asterisk.com',
          google_id: '109434756611345923855',
          token_id: 'eyJhbGciOiJSU',
        },
      })
    )

    await act(async () =>
      render(
        <Main>
          <Home />
        </Main>
      )
    )

    routerSpy = jest.spyOn(Router, 'push')
    logoutButton = screen.getByTestId('logout-btn')
    logout.mockImplementation(() => Promise.resolve())
  })

  it('should have logout button', () => {
    expect(logoutButton).toBeInTheDocument()
  })

  it('should call the "logout" function after clicking', async () => {
    await act(() => {
      fireEvent.click(logoutButton)
    })
    expect(logout).toHaveBeenCalledTimes(1)
  })
  it('should clear the cookies after signing out', () => {
    const cookieSpy = jest.spyOn(Cookies, 'remove')
    expect(cookieSpy).toHaveBeenCalledTimes(1)
    expect(cookieSpy).toHaveBeenCalledWith('user_signed')
  })
  it('should redirect to login after signing out', () => {
    expect(routerSpy).toHaveBeenCalledWith('/login')
  })
})
