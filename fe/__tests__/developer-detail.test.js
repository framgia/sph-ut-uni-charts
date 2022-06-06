import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import Router from 'next/router'
import mockRouter from 'next-router-mock'

import DeveloperDetail from '@/src/pages/DeveloperDetail'
jest.mock('next/router', () => require('next-router-mock'))

describe('When rendering developer detail page', () => {
  describe('when using go back button', () => {
    let addProjectButton, routerSpy

    describe('if project_id is not in url', () => {
      beforeEach(async () => {
        await act(async () => render(<DeveloperDetail />))
        routerSpy = jest.spyOn(Router, 'push')

        addProjectButton = screen.getByRole('back-button')
      })

      afterAll(() => {
        routerSpy.mockRestore()
      })

      it('should have a button to go back', () => {
        expect(addProjectButton).toBeInTheDocument()
      })

      it('should redirect to home page', () => {
        userEvent.click(addProjectButton)

        expect(routerSpy).toHaveBeenCalledTimes(1)
        expect(routerSpy).toHaveBeenCalledWith('/')
      })
    })

    describe('if project_id is in url', () => {
      beforeEach(async () => {
        mockRouter.setCurrentUrl('/developer-detail/1?project_id=1')

        await act(async () => render(<DeveloperDetail />))
        routerSpy = jest.spyOn(Router, 'push')

        addProjectButton = screen.getByRole('back-button')
      })

      afterAll(() => {
        routerSpy.mockRestore()
      })

      it('should have a button to go back', () => {
        expect(addProjectButton).toBeInTheDocument()
      })

      it('should redirect to previous page', async () => {
        userEvent.click(addProjectButton)

        expect(routerSpy).toHaveBeenCalledTimes(1)
        expect(routerSpy).toHaveBeenCalledWith('/project-detail/1')
      })
    })
  })

  describe('when rendering the developer details', () => {
    beforeEach(async () => {
      await act(async () => render(<DeveloperDetail />))
    })

    it("should display the developer's name", () => {
      const name = screen.getByRole('name')
      expect(name).toBeInTheDocument()
    })

    it("should display the developer's position", () => {
      const position = screen.getByRole('position')
      expect(position).toBeInTheDocument()
    })

    it("should display the developer's icon", () => {
      const image = screen.getByRole('img')
      expect(image).toBeInTheDocument()
    })

    it("should display the developer's stats in a table", () => {
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()

      const rows = screen.getAllByRole('row')
      expect(rows).toHaveLength(3)

      const columns = screen.getAllByRole('cell')
      expect(columns).toHaveLength(6)
    })
  })
})
