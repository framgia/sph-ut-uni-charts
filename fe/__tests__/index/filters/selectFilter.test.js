import { screen, waitFor } from '@testing-library/react'
import Router from 'next/router'
import userEvent from '@testing-library/user-event'

import * as providerApi from '@/src/api/providerApi'
import {
  mockGetProjects,
  renderComponent,
  clickFilterField,
  clickOption,
  paginationElements,
  filterElements,
} from '@/__tests__/utils/filterUtil'

jest.mock('next/router', () => require('next-router-mock'))
jest.mock('@/src/api/providerApi')

describe('When selecting an option by provider', () => {
  let selectField, spyRouter, spyGetProjects

  beforeEach(async () => {
    await renderComponent()

    const { selectFilterField } = await filterElements()
    selectField = selectFilterField
    spyRouter = jest.spyOn(Router, 'push')
    spyGetProjects = jest.spyOn(providerApi, 'getProjects')
  })

  it('should have select filter element for provider', () => {
    expect(selectField).toBeInTheDocument()
  })

  it('should have 5 filter options [backlog, trello, asana, jira, notion]', async () => {
    clickFilterField()

    let options = []
    await waitFor(async () => {
      const optionsNode = screen.getAllByRole('option')
      for (const [index, option] of optionsNode.entries()) {
        options[index] = option.innerHTML.toLowerCase()
        expect(option.getAttribute('id')).toMatch(/provider-select-option/i)
      }
    })

    const expectedOptions = ['backlog', 'trello', 'asana', 'notion', 'jira']
    expect(options).toEqual(expect.arrayContaining(expectedOptions))
  })

  it('should execute filter if option is changed', async () => {
    await clickOption('Backlog')

    expect(Router).toMatchObject({
      pathname: '/',
      query: { filterProviderName: 'backlog' },
    })
  })

  it('should not execute filter twice or more if the selected option value is the same', async () => {
    clickFilterField()

    // STEP #1 select the trello option twice
    const backlogOption = await screen.findByRole('option', {
      name: 'Trello',
    })
    userEvent.click(backlogOption)
    userEvent.click(backlogOption)

    mockGetProjects()

    expect(spyRouter).toBeCalled()
    expect(spyRouter).toHaveBeenCalledWith({
      pathname: '/',
      query: {
        searchProvider: '',
        filterProviderName: 'trello',
        page: 1,
      },
    })
  })
})

describe('When selecting option with other query filters', () => {
  it('should jump back to page 1 if filter is change', async () => {
    // STEP #1 render component initially at page 2
    await renderComponent({ page: 2 })
    const spyRouter = jest.spyOn(Router, 'push')

    const { activePageButton } = await paginationElements()
    expect(activePageButton).toContainHTML('2')

    // STEP #2 click filter option "trello"
    await clickOption('Trello')
    expect(spyRouter).toBeCalled()
    expect(spyRouter).toHaveBeenCalledWith({
      pathname: '/',
      query: {
        page: 1,
        filterProviderName: 'trello',
        searchProvider: '',
      },
    })
  })

  it('should retain search values if filter event is fired', async () => {
    // STEP #1 render component initially with the following search text
    const searchText = 'back'
    await renderComponent({ searchProvider: searchText })
    const spyRouter = jest.spyOn(Router, 'push')

    // STEP #2 click filter option "trello"
    await clickOption('Trello')
    expect(spyRouter).toHaveBeenCalledWith({
      pathname: '/',
      query: {
        page: 1,
        filterProviderName: 'trello',
        searchProvider: searchText,
      },
    })
  })
})
