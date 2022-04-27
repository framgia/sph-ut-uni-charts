import { render, screen } from '@testing-library/react'
import ProjectDetail from '@/src/pages/projects/ProjectDetail'
import { developersList } from '@/src/utils/dummyData'

describe('Project Detail', () => {
  it('has page header', () => {
    render(<ProjectDetail />)

    // TODO: make project name dynamic
    const header = screen.getByRole('heading', { name: /project name detail/i })
    expect(header).toBeInTheDocument()
  })

  it('has velocity chart', () => {
    render(<ProjectDetail />)

    const velocityChart = screen.getByRole('velocity-chart')
    expect(velocityChart).toBeInTheDocument()
  })

  it('has burn down chart', () => {
    render(<ProjectDetail />)

    const burnDownChart = screen.getByRole('burn-down-chart')
    expect(burnDownChart).toBeInTheDocument()
  })

  it('has burn up chart', () => {
    render(<ProjectDetail />)

    const burnUpChart = screen.getByRole('burn-up-chart')
    expect(burnUpChart).toBeInTheDocument()
  })

  it('has developer list', () => {
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
})
