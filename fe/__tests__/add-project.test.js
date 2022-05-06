require('dotenv').config()
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddProject from '@/src/pages/projects/AddProject'
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')

const mockAxios = new MockAdapter(axios)
const URL = process.env.NEXT_PUBLIC_BFF_API

describe('Add Project', () => {
  beforeEach(() => {
    mockAxios.onGet(`${URL}providers/`).reply(200, [
      {
        id: 33,
        name: 'Backlog',
        space_key: 'framgiaph',
      },
    ])
  })

  it('Has a header', () => {
    render(<AddProject />)
    const header = screen.getByRole('heading', { name: /ADD PROJECT/i })

    expect(header).toBeInTheDocument()
  })

  it('Has Select Provider Dropdown', () => {
    render(<AddProject />)
    const providerDropdown = screen.getByPlaceholderText(/select a provider/i)

    expect(providerDropdown).toBeInTheDocument()
  })

  it('Has initial values under provider dropdown after fetch provider api call', async () => {
    render(<AddProject />)
    const providerDropdown = await screen.getByPlaceholderText(
      /select a provider/i
    )

    userEvent.click(providerDropdown)
    const initialOptions = await screen.findAllByRole('option')

    expect(initialOptions).toHaveLength(2)
  })

  it('Enter API key will show if Provider Dropdown is clicked and new provider option is selected', async () => {})

  it('Select Project will show if Provider Dropdown is clicked and selected one of registered option', async () => {})

  it('Select Project will show with dropdown options from api if Entered an apikey and clicks Connect Provide button', async () => {})

  it('Success or Error notification will show once Add Project is clicked', async () => {})

  it('Error Invalid API Key will show if api key is invalid', async () => {})

  it('user clicks add new provider option', () => {
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
