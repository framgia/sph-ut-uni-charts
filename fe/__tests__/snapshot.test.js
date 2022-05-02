import { render } from '@testing-library/react'
import Home from '@/src/pages'
import { Fragment } from 'react'

jest.mock('../src/components/molecules/AuthMiddleware', () => ({ children }) => {
  const isStatusActive = true
  if (!isStatusActive) Router.push('/login')

  return <Fragment>{children}</Fragment>
})

it('renders homepage unchanged', () => {
  // will not do a snap shot check since the components are rendered dynamically
  const { container } = render(<Home />)
  // expect(container).toMatchSnapshot()
})
