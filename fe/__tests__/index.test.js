require('dotenv').config()
import axios from 'axios'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import mockRouter from 'next-router-mock'

import Home from '@/src/pages'
import testData from './constants/testData.json'
import Router from 'next/router'
import Cookies from 'js-cookie'
import { logout } from '@/src/api/authApi'

const mockAxios = new MockAdapter(axios)
const URL = process.env.NEXT_PUBLIC_BFF_API

jest.mock('next/router', () => require('next-router-mock'))
jest.mock('@/src/api/authApi')
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  setMockImplementation: jest.fn(),
  remove: jest.fn(),
}))

describe('When rendering home page', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/')
    mockAxios.onGet(`${URL}projects`).reply(200, testData.projects)

    Cookies.get.mockReturnValueOnce(
      JSON.stringify({
        user_signed: {
          email: 'joshua.escarilla@sun-asterisk.com',
          google_id: '109434756611345923855',
          token_id: 'eyJhbGciOiJSU',
        },
      })
    )
  })

  describe('when using logout function', () => {
    let logoutButton, routerSpy

    beforeEach(async () => {
      await act(async () => render(<Home />))

      routerSpy = jest.spyOn(Router, 'push')
      logoutButton = screen.getByRole('button', { name: /logout/i })
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
      expect(routerSpy).toHaveBeenCalledTimes(1)
      expect(routerSpy).toHaveBeenCalledWith('/login')
    })
  })

  it('should render the table correctly', async () => {
    await act(async () => render(<Home />))

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()

    const rows = await screen.findAllByRole('project-trow')
    expect(rows).toHaveLength(3)

    const columns = screen.getAllByRole('columnheader')
    expect(columns).toHaveLength(4)
  })
  it('should have a button to add project', async () => {
    await act(async () => render(<Home />))

    const addProjectButton = screen.getByRole('button', {
      name: /add project/i,
    })
    expect(addProjectButton).toBeInTheDocument()
  })

  describe('when using search function', () => {
    let searchField

    beforeEach(async () => {
      mockAxios.onGet(`${URL}projects`).reply(200, [testData.projects[0]])

      await act(async () => render(<Home />))

      searchField = screen.getByRole('textbox', {
        name: /filter by name/i,
      })
    })

    it('should display the search field', async () => {
      searchField = screen.getByRole('textbox', {
        name: /filter by name/i,
      })

      expect(searchField).toBeInTheDocument()
    })
    it('should be able to search a project', async () => {
      userEvent.type(searchField, 'Mailtrap')
      fireEvent.submit(searchField)

      const rows = await screen.findAllByRole('project-trow')
      expect(rows).toHaveLength(1)
    })
  })

  describe('when using filter function', () => {
    let selectField

    beforeEach(async () => {
      mockAxios.onGet(`${URL}projects`).reply(200, testData.projects.slice(1))

      await act(async () => render(<Home />))

      selectField = screen.getByRole('textbox', {
        name: /filter by provider/i,
      })
    })

    it('should display the filter select tag', async () => {
      expect(selectField).toBeInTheDocument()

      // should be hidden initially
      const hiddenOptions = screen.queryAllByRole('option')
      expect(hiddenOptions).toHaveLength(0)

      // click the select field
      userEvent.click(selectField)

      // check if the dropdown is shown
      const shownOptions = await screen.findAllByRole('option')
      expect(shownOptions).toHaveLength(5)

      // click the select field again
      userEvent.click(selectField)

      // check if the dropdown is hidden
      const hiddenOptionsAgain = screen.queryAllByRole('option')
      expect(hiddenOptionsAgain).toHaveLength(0)
    })
    it('should be able to filter projects by provider', async () => {
      userEvent.click(selectField)

      // select the asana option
      const backlogOption = await screen.findByRole('option', {
        name: 'Backlog',
      })
      userEvent.click(backlogOption)

      const rows = await screen.findAllByRole('project-trow')
      expect(rows).toHaveLength(2)
    })
  })

  describe('when using reset function', () => {
    let selectField, resetButton, inputField

    beforeEach(async () => {
      mockAxios.onGet(`${URL}projects`).reply(200, testData.projects)

      await act(async () => render(<Home />))

      selectField = screen.getByRole('textbox', {
        name: /filter by provider/i,
      })
      resetButton = screen.getByRole('button', { name: /reset filters/i })
      inputField = screen.getByRole('textbox', {
        name: /filter by name/i,
      })
    })

    it('should display the reset button', async () => {
      expect(resetButton).toBeInTheDocument()
    })
    it('should be able to clear filter and searches', async () => {
      userEvent.clear(inputField)
      userEvent.type(inputField, 'test')

      // verify that inpout field has value of test
      expect(inputField).toHaveValue('test')

      // user clicks reset
      userEvent.click(resetButton)

      waitFor(() => {
        expect(selectField).toHaveValue('')
        expect(inputField).toHaveValue('')
      })

      const rows = await screen.findAllByRole('project-trow')
      expect(rows).toHaveLength(3)
    })
  })

  it('should have a delete button for each row', async () => {
    await act(async () => render(<Home />))
    const rows = await screen.findAllByRole('project-trow')

    const deleteButtons = screen.queryAllByRole('button', { name: /delete/i })
    expect(deleteButtons.length).toBe(rows.length)
  })
})
