import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'

import { getProjects, deleteProject } from '@/src/api/providerApi'
import Home from '@/src/pages/index'
import testData from '../constants/testData.json'
import * as bffService from '@/src/api/providerApi'

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

describe('when using delete function', () => {
  let rows, deleteButtons, deleteProjectSpy, getProjectsSpy
  const projectData = testData.projects.data[0]

  beforeEach(async () => {
    getProjects.mockImplementation(() => {
      return Promise.resolve().then(() => {
        return { data: testData.projects }
      })
    })
    deleteProject.mockImplementation(() => {
      return Promise.resolve().then(() => {
        return { data: testData.projects[0] }
      })
    })

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
