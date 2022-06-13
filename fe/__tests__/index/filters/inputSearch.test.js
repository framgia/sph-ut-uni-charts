import Router from 'next/router'
import userEvent from '@testing-library/user-event'

import * as providerApi from '@/src/api/providerApi'

import {
  mockGetProjects,
  renderComponent,
  searchElement,
  filterElements,
} from '@/__tests__/utils/filterUtil'

jest.mock('next/router', () => require('next-router-mock'))
jest.mock('@/src/api/providerApi')

describe('When searching a project name', () => {
  let searchField, spyRouter
  const searchText = 'a'

  afterEach(() => {
    providerApi.getProjects.mockReset()
    jest.clearAllMocks()
  })

  beforeEach(async () => {
    await renderComponent()

    searchField = searchElement()
    spyRouter = jest.spyOn(Router, 'push')

    // step #1 search something in the field and press enter key
    userEvent.type(searchField, `${searchText}{enter}`)
    mockGetProjects()
  })

  it('should have a search field', async () => {
    expect(searchField).toBeInTheDocument()
  })

  it('should execute searching after pressing enter key', async () => {
    expect(spyRouter).toBeCalled()
    expect(spyRouter).toBeCalledWith({
      pathname: '/',
      query: {
        searchProvider: searchText,
        filterProviderName: '',
        page: 1,
      },
    })
  })

  it('should execute searching if the field was cleared', () => {
    userEvent.type(searchField, `{backspace}`)
    expect(spyRouter).toBeCalledTimes(2)
    expect(spyRouter).toBeCalledWith({
      pathname: '/',
      query: {
        searchProvider: '',
        filterProviderName: '',
        page: 1,
      },
    })
  })

  it('should not execute searching twice or more if value is the same', () => {
    userEvent.type(searchField, '{enter}')
    expect(spyRouter).toBeCalledTimes(2)
    expect(spyRouter).toHaveBeenCalledWith({
      pathname: '/',
      query: {
        searchProvider: searchText,
        filterProviderName: '',
        page: 1,
      },
    })
  })
})

describe('When searching with other query filters', () => {
  it('should jump back to page 1', async () => {
    await renderComponent({ page: 2 })
    const spyRouter = jest.spyOn(Router, 'push')

    userEvent.type(searchElement(), 'any{enter}')
    mockGetProjects()

    expect(spyRouter).toBeCalled()
    expect(spyRouter).toHaveBeenCalledWith({
      pathname: '/',
      query: {
        searchProvider: 'any',
        filterProviderName: '',
        page: 1,
      },
    })
  })

  it('should retain selected filter option', async () => {
    // STEP #1 render page with initial option selected "backlog"
    await renderComponent({ filterProviderName: 'backlog' })
    const { filterInput } = await filterElements()
    expect(filterInput).toHaveValue('backlog')

    // STEP #2 search something and check if selected option was still "backlog"
    userEvent.type(searchElement(), 'any{enter}')
    const { filterInput: inputAfterSearching } = await filterElements()
    expect(inputAfterSearching).toHaveValue('backlog')
  })

  it('should remain focus the search input field', async () => {
    // STEP #1 render page having search field initially focused
    await renderComponent()
    const searchField = searchElement()
    expect(searchField).toHaveFocus()

    // STEP #2 search something and check if selected option was still focused
    userEvent.type(searchField, 'any{enter}')
    expect(searchElement()).toHaveFocus()
  })
})
