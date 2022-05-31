import { render, screen } from '@testing-library/react'
import ProjectDetail from '@/src/pages/projects/ProjectDetail'
import { developersList } from '@/src/utils/dummyData'
import * as bffService from '@/src/services/bffService'

describe('When rendering detail page', () => {
  beforeAll(() => {
    jest.spyOn(require('next/router'), 'useRouter').mockImplementation(() => {
      return { query: { id: 3 } }
    })
  })

  it('should have page header', () => {
    render(<ProjectDetail />)

    // TODO: make project name dynamic
    const header = screen.getByRole('heading', { name: /project name detail/i })
    expect(header).toBeInTheDocument()
  })

  it('should have velocity chart and text for velocity', () => {
    render(<ProjectDetail />)

    const velocityChart = screen.getByRole('velocity-chart')
    expect(velocityChart).toBeInTheDocument()

    const velocity = screen.getByRole('heading', { name: /velocity/i })
    expect(velocity).toBeInTheDocument()
  })

  describe('when rendering burn down chart', () => {
    let getSprintDataSpy

    beforeEach(() => {
      getSprintDataSpy = jest.spyOn(bffService, 'getActiveSprintData')
      render(<ProjectDetail />)
    })

    afterEach(() => {
      getSprintDataSpy.mockRestore()
    })

    it('should have a burn down chart', () => {
      const burnDownChart = screen.getByRole('burn-down-chart')
      expect(burnDownChart).toBeInTheDocument()
    })

    it('should call getActiveSprintData() once', () => {
      expect(getSprintDataSpy).toHaveBeenCalledTimes(1)
    })

    // temporarily commented out since it is commented out in the page
    /*const selectField = screen.getByRole('textbox', {
          name: /selected sprint/i,
        })
        expect(selectField).toBeInTheDocument()*/
  })

  // temporarily commented out since it is commented out in the page
  /*it('has a select field for the user to choose the sprint for burn down chart', async () => {
    render(<ProjectDetail />)

    const selectField = screen.getByRole('textbox', {
      name: /selected sprint/i,
    })
    expect(selectField).toBeInTheDocument()

    // should be hidden initially
    const hiddenOptions = screen.queryAllByRole('option')
    expect(hiddenOptions).toHaveLength(0)

    // click the select field
    userEvent.click(selectField)

    // check if the dropdown is shown
    const shownOptions = await screen.findAllByRole('option')
    expect(shownOptions).toHaveLength(sprintSelectFields.length)

    // click the select field again
    userEvent.click(selectField)

    // check if the dropdown is hidden
    const hiddenOptionsAgain = screen.queryAllByRole('option')
    expect(hiddenOptionsAgain).toHaveLength(0)
  })

  it('lets the user change the select field value', async () => {
    render(<ProjectDetail />)
    const selectField = screen.getByRole('textbox', {
      name: /selected sprint/i,
    })

    // click the select field
    userEvent.click(selectField)

    // select the second option
    const secondOption = await screen.findByRole('option', {
      name: sprintSelectFields[1].label,
    })
    userEvent.click(secondOption)

    // check if asana is selected
    expect(selectField).toHaveValue(sprintSelectFields[1].label)
  })

  it('has burn up chart', () => {
    render(<ProjectDetail />)

    const burnUpChart = screen.getByRole('burn-up-chart')
    expect(burnUpChart).toBeInTheDocument()
  })*/

  it('should have developer list', () => {
    render(<ProjectDetail />)

    const header = screen.getByRole('heading', { name: /developers/i })
    expect(header).toBeInTheDocument()

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()

    // includes the table header
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(developersList.length + 1)

    const columns = screen.getAllByRole('columnheader')
    expect(columns).toHaveLength(2)
  })

  it('should have a button to redirect to home page', () => {
    render(<ProjectDetail />)

    const redirectButton = screen.getByRole('link', {
      name: /back to home/i,
    })
    expect(redirectButton).toBeInTheDocument()
  })
})
