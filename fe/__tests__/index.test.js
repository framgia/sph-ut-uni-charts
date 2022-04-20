import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Home from '@/src/pages'

describe('Home', () => {
  it('renders home page title', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: /welcome to uni chart/i,
    })

    expect(heading).toBeInTheDocument()
  })

  it('renders the table correctly', () => {
    render(<Home />)

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()

    // includes the table header
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(6)

    const columns = screen.getAllByRole('columnheader')
    expect(columns).toHaveLength(3)
  })

  it('input field is working properly', () => {
    render(<Home />)

    const inputField = screen.getByRole('textbox', { name: /filter by name/i })

    userEvent.clear(inputField)
    userEvent.type(inputField, 'test')
    expect(inputField).toHaveValue('test')
  })

  it('hides and shows select properly', async () => {
    render(<Home />)

    const selectField = screen.getByRole('textbox', {
      name: /filter by provider/i,
    })
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

  it('lets the user change the select field value', async () => {
    render(<Home />)
    const selectField = screen.getByRole('textbox', {
      name: /filter by provider/i,
    })

    // click the select field
    userEvent.click(selectField)

    // select the asana option
    const optionAsana = await screen.findByRole('option', { name: 'Asana' })
    userEvent.click(optionAsana)

    // check if asana is selected
    expect(selectField).toHaveValue('Asana')
  })

  it('lets the user reset the filters, user only selected provider', async () => {
    render(<Home />)

    const selectField = screen.getByRole('textbox', {
      name: /filter by provider/i,
    })
    const resetButton = screen.getByRole('button', { name: /reset filters/i })
    const inputField = screen.getByRole('textbox', { name: /filter by name/i })

    // user selects the filter Jira
    userEvent.click(selectField)
    const optionJira = await screen.findByRole('option', { name: 'Jira' })
    userEvent.click(optionJira)
    // verify that option Jira is selected
    expect(selectField).toHaveValue('Jira')

    // user clicks reset
    userEvent.click(resetButton)
    expect(selectField).toHaveValue('')
    expect(inputField).toHaveValue('')
  })

  it('lets the user reset the filters, user only selected project name', async () => {
    render(<Home />)

    const selectField = screen.getByRole('textbox', {
      name: /filter by provider/i,
    })
    const resetButton = screen.getByRole('button', { name: /reset filters/i })
    const inputField = screen.getByRole('textbox', { name: /filter by name/i })

    userEvent.clear(inputField)
    userEvent.type(inputField, 'test')
    // verify that inpout field has value of test
    expect(inputField).toHaveValue('test')

    // user clicks reset
    userEvent.click(resetButton)
    expect(selectField).toHaveValue('')
    expect(inputField).toHaveValue('')
  })

  it('lets the user reset the filters, user selected project name and provider', async () => {
    render(<Home />)

    const selectField = screen.getByRole('textbox', {
      name: /filter by provider/i,
    })
    const resetButton = screen.getByRole('button', { name: /reset filters/i })
    const inputField = screen.getByRole('textbox', { name: /filter by name/i })

    // user selects the filter Jira and filtered by name test
    userEvent.click(selectField)
    const optionJira = await screen.findByRole('option', { name: 'Jira' })
    userEvent.click(optionJira)
    // verify that option Jira is selected
    expect(selectField).toHaveValue('Jira')

    userEvent.clear(inputField)
    userEvent.type(inputField, 'test')
    // verify that inpout field has value of test
    expect(inputField).toHaveValue('test')

    // user clicks reset
    userEvent.click(resetButton)
    expect(selectField).toHaveValue('')
    expect(inputField).toHaveValue('')
  })

  it('lets the user change the current page', async () => {
    render(<Home />)

    const pageFive = screen.getByRole('button', { name: /page 5/i })
    userEvent.click(pageFive)

    // page 3 is not visible if selected page is 5
    const pageThree = screen.queryByRole('button', { name: /page 3/i })
    expect(pageThree).not.toBeInTheDocument()

    // user clicks next, page four should no longer be visible and page 7 will show
    const nextPage = screen.getByRole('button', { name: /next page/i })
    userEvent.click(nextPage)

    const pageFour = screen.queryByRole('button', { name: /page 4/i })
    expect(pageFour).not.toBeInTheDocument()

    const pageSeven = screen.getByRole('button', { name: /page 7/i })
    expect(pageSeven).toBeInTheDocument()
  })

  it('has an add project button', () => {
    render(<Home />)

    const addProjectButton = screen.getByRole('button', {
      name: /add project/i,
    })
    expect(addProjectButton).toBeInTheDocument()
  })
})
