require('dotenv').config()
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import AddProject from '@/src/pages/projects/AddProject'
import { baseAuthApi } from '@/src/api/base'
import mockRouter from 'next-router-mock'
import Main from '@/src/templates/Main'
const MockAdapter = require('axios-mock-adapter')

const mockAxios = new MockAdapter(baseAuthApi, {
  onNoMatch: 'throwException',
})

beforeAll(() => {
  mockRouter.setCurrentUrl('/add-project')
  mockAxios.reset()
})

afterEach(cleanup)
jest.mock('next/router', () => require('next-router-mock'))

describe('When adding a project', () => {
  beforeEach(async () => {
    mockAxios.onGet('/providers/').reply(200, [
      {
        id: 33,
        name: 'Backlog',
        space_key: 'framgiaph',
      },
    ])
    mockAxios.onGet('/backlog/projects').reply(200, [
      {
        id: 18616,
        projectKey: 'FRAMGIAPH_BOOKSHELF',
        name: 'FramgiaPH BookShelf',
      },
      {
        id: 25770,
        projectKey: 'DOKODEMO',
        name: 'Dokodemo-English',
      },
    ])
    await act(async () =>
      render(
        <Main>
          <AddProject />
        </Main>
      )
    )
  })

  it('should have a header and a select "Provider Dropdown"', () => {
    const providerDropdown = screen.getByPlaceholderText(/select a provider/i)

    expect(providerDropdown).toBeInTheDocument()
  })

  describe('When clicking the providers dropdown', () => {
    beforeEach(async () => {
      await act(
        async () =>
          await userEvent.click(
            screen.getByPlaceholderText(/select a provider/i)
          )
      )
    })

    it('should have initial values under "Provider Dropdown" after fetch provider api call', async () => {
      const options = await screen.findAllByRole('option')
      expect(options).toHaveLength(2)
    })

    describe('When add new provider is selected', () => {
      beforeEach(async () => {
        const addProvider = await screen.findByRole('option', {
          name: /add new provider/i,
        })
        await act(() => userEvent.click(addProvider))

        const connectButton = await screen.findByRole('button', {
          name: /connect provider/i,
        })
        await act(() => fireEvent.click(connectButton))
      })

      it('should show "Error Invalid API Key" if api key is invalid', async () => {
        const connectButton = await screen.findByRole('button', {
          name: /connect provider/i,
        })
        await act(() => fireEvent.click(connectButton))
        const apikeyError = await screen.findByText('API key is required')
        expect(apikeyError).toBeInTheDocument()
      })

      it('should show success notification when adding project if "enter new provider" is selected', async () => {
        mockAxios.onGet('/providers/add').reply(200, {
          name: 'Backlog',
          space_key: 'framgiaph',
          api_key: 'apikey123',
        })

        const apiKeyInput = await screen.findByPlaceholderText(/enter api key/i)

        const connectButton = await screen.findByRole('button', {
          name: /connect provider/i,
        })

        expect(apiKeyInput).toBeInTheDocument()
        expect(connectButton).toBeInTheDocument()

        await act(() =>
          fireEvent.change(apiKeyInput, { target: { value: 'apikey123' } })
        )
        await act(async () => await fireEvent.click(connectButton))

        const projectDropdown = await screen.findByPlaceholderText(
          /select a project/i
        )
        await act(async () => await userEvent.click(projectDropdown))

        const projects = await screen.findByRole('option', {
          name: /FramgiaPH BookShelf/i,
          name: /Dokodemo-English/i,
        })
        expect(projects).toBeInTheDocument()

        const projectOption = await screen.findByRole('option', {
          name: /framgiaPH bookshelf/i,
        })
        expect(projectOption).toBeInTheDocument()

        await act(() => userEvent.click(projectOption))
        await act(async () => await userEvent.click(projectDropdown))
        await act(() =>
          userEvent.click(
            screen.getByRole('option', {
              name: /framgiaPH bookshelf/i,
            })
          )
        )

        const addProjectButton = await screen.findByRole('button', {
          name: /add project/i,
        })
        expect(addProjectButton).toBeInTheDocument()
        await act(() => fireEvent.click(addProjectButton))

        const toast = document.querySelector('div[dir="ltr"]')
        expect(toast).toBeInTheDocument()
      })
    })
  })
})
