import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import mockRouter from 'next-router-mock'
import userEvent from '@testing-library/user-event'

import * as providerApi from '@/src/api/providerApi'
import testData from '@/__tests__/constants/testData.json'
import HomePageHeader from '@/src/pages/index/components/Header'

export const mockGetProjects = (page = 1) => {
  const responseData = testData.projects
  providerApi.getProjects.mockImplementationOnce(() => {
    return Promise.resolve().then(() => {
      return { data: { ...responseData, page } }
    })
  })
}

/**
 * @param Object params
 * Render header section of Home Page
 */
export const renderComponent = async (params = {}) => {
  const { filterProviderName = '', searchProvider = '', page = '1' } = params

  mockRouter.setCurrentUrl({
    route: '/',
    pathname: '',
    query: {
      filterProviderName,
      searchProvider,
      page,
    },
    push: jest.fn(),
  })

  let responseData = testData.projects
  responseData = { ...responseData, page: page || 1 }
  providerApi.getProjects.mockImplementationOnce(() => {
    return Promise.resolve().then(() => {
      return { data: responseData }
    })
  })

  await act(async () => {
    render(<HomePageHeader pagination={responseData} />)
  })
}

/**
 * Trigger click event in provider filter field
 */
export const clickFilterField = async () => {
  act(() => {
    const selectField = screen.getByRole('textbox', {
      name: /filter by provider/i,
    })
    userEvent.click(selectField)
  })
}

/**
 * @param String option
 * Trigger click event in specified option in provider filter field
 */
export const clickOption = async (option = '') => {
  clickFilterField()

  const optionElement = await screen.findByRole('option', {
    name: option,
  })
  userEvent.click(optionElement)
}

/**
 * @returns Object
 * Get the elements for pagination
 */
export const paginationElements = async () => {
  const pagination = await screen.getByRole('pagination')
  const activePageButton = pagination.querySelector(
    '.mantine-Pagination-active'
  )

  const pageItems = pagination.querySelectorAll(
    '.mantine-Pagination-item:not(.mantine-Pagination-dots)'
  )

  return { pagination, activePageButton, pageItems }
}

/**
 * @returns Object
 * Get the elements for provider filter
 */
export const filterElements = async () => {
  const selectFilterField = await screen.findByRole('project-select-field')
  const filterInput = await selectFilterField.querySelector(
    'input[type="hidden"]'
  )

  return { selectFilterField, filterInput }
}

export const searchElement = () =>
  screen.getByRole('textbox', {
    name: /filter by name/i,
  })
