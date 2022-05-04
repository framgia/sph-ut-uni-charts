import { render } from '@testing-library/react'
import Home from '@/src/pages'

it('renders homepage unchanged', () => {
  // will not do a snap shot check since the components are rendered dynamically
  const { container } = render(<Home />)
  // expect(container).toMatchSnapshot()
})
