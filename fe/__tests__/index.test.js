require('dotenv').config()
import axios from 'axios'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import MockAdapter from 'axios-mock-adapter'

import Home from '@/src/pages'
import testData from './constants/testData.json'

const mockAxios = new MockAdapter(axios)
const URL = process.env.NEXT_PUBLIC_BFF_API

jest.mock('next/router', () => {
  return {
    route: '/',
    pathname: '',
    query: {
      provider: '',
      searchProvider: '',
    },
    asPath: '',
    push: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
    beforePopState: jest.fn(() => null),
    prefetch: jest.fn(() => null),
  }
})

describe('When rendering home page', () => {
  beforeEach(() => {
    mockAxios.onGet(`${URL}projects`).reply(200, testData.projects)
  })

  it('should render successfully when user is authenticated', async () => {
    await act(async () => render(<Home />))

    const hasHeading = screen.getByRole('heading', {
      name: /welcome to uni chart/i,
    })
    const hasLogoutButton = screen.getByRole('button', { name: /logout/i })

    expect(hasHeading).toBeInTheDocument()
    expect(hasLogoutButton).toBeInTheDocument()
  })
  it('should render the table correctly', async () => {
    await act(async () => render(<Home />))

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()

    const rows = await screen.findAllByRole('project-trow')
    expect(rows).toHaveLength(3)

    const columns = screen.getAllByRole('columnheader')
    expect(columns).toHaveLength(3)
  })
  it('should have a button to add project', async () => {
    await act(async () => render(<Home />))

    const addProjectButton = screen.getByRole('button', {
      name: /add project/i,
    })
    expect(addProjectButton).toBeInTheDocument()
  })

  describe('when using search functionality', () => {
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
})
