require('dotenv').config()
import {
  fireEvent,
  render,
  waitFor,
  screen,
  cleanup,
} from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'
import mockRouter from 'next-router-mock'

import Home from '@/src/pages'
import testData from './constants/testData.json'
import Router from 'next/router'
import Cookies from 'js-cookie'
import { logout } from '@/src/api/authApi'
import * as bffService from '@/src/api/providerApi'
import Main from '@/src/templates/Main'
import { baseAuthApi } from '@/src/api/base'

const mockAxios = new MockAdapter(baseAuthApi, {
  onNoMatch: 'throwException',
})

beforeAll(() => {
  mockAxios.reset()
})

afterEach(cleanup)

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
    mockAxios.onGet('/projects').reply(200, testData.projects)
    mockAxios
      .onDelete('/projects/190', 'backlog')
      .reply(200, testData.projects[0])

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
      mockAxios.onGet('/projects').reply(200, [testData.projects[0]])

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
      mockAxios.onGet('/projects').reply(200, testData.projects.slice(1))

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

  describe('when using delete function', () => {
    let rows, deleteButtons, deleteProjectSpy, getProjectsSpy
    const projectData = testData.projects[0]

    beforeEach(async () => {
      deleteProjectSpy = jest.spyOn(bffService, 'deleteProject')
      getProjectsSpy = jest.spyOn(bffService, 'getProjects')

      await act(async () => render(<Home />))
      rows = await screen.findAllByRole('project-trow')

      deleteButtons = screen.queryAllByRole('button', { name: /delete/i })
    })

    afterEach(() => {
      deleteProjectSpy.mockClear()
      getProjectsSpy.mockClear()
    })

    afterAll(() => {
      deleteProjectSpy.mockRestore()
      getProjectsSpy.mockRestore()
    })

    it('should have a delete button for each row', () => {
      expect(deleteButtons.length).toBe(rows.length)
    })

    it('should have the delete modal hidden upon page load', async () => {
      const deleteModal = screen.queryByRole('delete-modal')
      expect(deleteModal).not.toBeInTheDocument()
    })

    it('should be able to open and close the delete modal', async () => {
      userEvent.click(deleteButtons[0])

      let deleteModal = await screen.findByRole('delete-modal')
      expect(deleteModal).toBeInTheDocument()

      const cancelButton = screen.getByRole('cancel-delete')
      expect(cancelButton).toBeInTheDocument()

      userEvent.click(cancelButton)

      await waitFor(() => {
        deleteModal = screen.queryByRole('heading', {
          name: /are you sure you want to delete this project/i,
        })
        expect(deleteModal).not.toBeInTheDocument()
      })
    })

    it('should call the deleteProject service', async () => {
      userEvent.click(deleteButtons[0])

      let deleteModal = await screen.findByRole('delete-modal')
      expect(deleteModal).toBeInTheDocument()

      const confirmButton = screen.getByRole('confirm-delete')
      expect(confirmButton).toBeInTheDocument()

      await act(() => {
        userEvent.click(confirmButton)
      })

      expect(deleteProjectSpy).toHaveBeenCalledTimes(1)
      expect(deleteProjectSpy).toHaveBeenCalledWith(
        projectData.id,
        projectData.provider.name.toLowerCase()
      )

      // need to add this otherwise the next test will fail to find 'project-trow'
      await new Promise((r) => setTimeout(r, 1))
    })

    it('should call the getProjects service', async () => {
      userEvent.click(deleteButtons[0])

      let deleteModal = await screen.findByRole('delete-modal')
      expect(deleteModal).toBeInTheDocument()

      const confirmButton = screen.getByRole('confirm-delete')
      expect(confirmButton).toBeInTheDocument()

      userEvent.click(confirmButton)

      await waitFor(() => {
        expect(getProjectsSpy).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('when using reset function', () => {
    let selectField, resetButton, inputField

    beforeEach(async () => {
      mockAxios.onGet('/projects').reply(200, testData.projects)

      await act(async () => render(<Home />))

      selectField = await screen.getByPlaceholderText(/provider/i)
      resetButton = await screen.getByTestId('reset-btn')
      inputField = await screen.getByPlaceholderText(/project name/i)
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
})
