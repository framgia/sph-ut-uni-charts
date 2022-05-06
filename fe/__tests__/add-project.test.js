require('dotenv').config()
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddProject from '@/src/pages/projects/AddProject'
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')

const mockAxios = new MockAdapter(axios)
const URL = process.env.NEXT_PUBLIC_BFF_API

describe('When adding a project', () => {
  beforeEach(() => {
    mockAxios.onGet(`${URL}providers/`).reply(200, [
      {
        id: 33,
        name: 'Backlog',
        space_key: 'framgiaph',
      },
    ])
  })

  it('should have a header', () => {
    render(<AddProject />)
    const header = screen.getByRole('heading', { name: /ADD PROJECT/i })

    expect(header).toBeInTheDocument()
  })

  it('should have a select "Provider Dropdown"', () => {
    render(<AddProject />)
    const providerDropdown = screen.getByPlaceholderText(/select a provider/i)

    expect(providerDropdown).toBeInTheDocument()
  })

  it('should have initial values under "Provider Dropdown" after fetch provider api call', async () => {
    render(<AddProject />)
    const providerDropdown = screen.getByPlaceholderText(/select a provider/i)

    userEvent.click(providerDropdown)

    waitFor(() => {
      expect(screen.findAllByRole('option')).toHaveLength(2)
    })
  })

  it('should show api key field if "Provider Dropdown" is clicked and "New Provider Option" is selected', async () => {
    render(<AddProject />)
    const providerDropdown = screen.getByPlaceholderText(/select a provider/i)

    userEvent.click(providerDropdown)

    waitFor(() => {
      const addProvider = screen.getByRole('option', {
        name: /add new provider/i,
      })
      expect(addProvider).toBeInTheDocument()

      userEvent.click(addProvider)

      const apiKey = screen.getByPlaceholderText(/enter api key/i)

      const connectButton = screen.getByRole('button', {
        name: /connect provider/i,
      })

      expect(apiKey).toBeInTheDocument()
      expect(connectButton).toBeInTheDocument()
    })
  })

  it('should show the "Select Project" if "Provider Dropdown" is clicked and selected one of registered option', async () => {})

  it('should show the "Select Project" with dropdown options from api if Entered an apikey and clicks Connect Provide button', async () => {})

  it('should show "Success or Error notification" once "Add Project" is clicked', async () => {})

  it('should show "Error Invalid API Key" if api key is invalid', async () => {})

  it('should user clicks add new provider option', () => {})

  // it('initial values under project dropdown', async () => {
  //   render(<AddProject />)

  //   const projectDropdown = screen.getByPlaceholderText(/select a project/i)
  //   userEvent.click(projectDropdown)

  //   const listProjects = await screen.findAllByRole('option')
  //   const projects = listProjects.map((proj) => proj.textContent)
  //   expect(projects).toEqual(['Yamato', 'Safie', '01Booster'])
  // })

  // it('Action buttons', () => {
  //   render(<AddProject />)

  //   const addProjectButton = screen.getByRole('button', {
  //     name: /add project/i,
  //   })

  //   const cancelButton = screen.getByRole('button', { name: /cancel/i })

  //   expect(addProjectButton).toBeInTheDocument()
  //   expect(cancelButton).toBeInTheDocument()
  // })
})
