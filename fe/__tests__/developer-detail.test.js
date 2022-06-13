import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import Router from 'next/router'
import mockRouter from 'next-router-mock'
import { getDeveloperInfo, getDeveloperIcon } from '@/src/api/providerApi'
import * as providerApi from '@/src/api/providerApi'
import testData from './constants/testData.json'

import DeveloperDetail from '@/src/pages/DeveloperDetail'
jest.mock('next/router', () => require('next-router-mock'))
jest.mock('@/src/api/providerApi')

beforeEach(() => {
  getDeveloperInfo.mockImplementation(() => {
    return Promise.resolve().then(() => {
      return { data: testData.developerInfo }
    })
  })
  getDeveloperIcon.mockImplementation(() => {
    return Promise.resolve().then(() => {
      return { data: 'data:image/png;base64,iVBOR' }
    })
  })
})

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
    let getDeveloperInfoSpy, getDeveloperIconSpy, routerSpy

    beforeEach(async () => {
      getDeveloperInfoSpy = jest.spyOn(providerApi, 'getDeveloperInfo')
      getDeveloperIconSpy = jest.spyOn(providerApi, 'getDeveloperIcon')

      routerSpy = jest
        .spyOn(require('next/router'), 'useRouter')
        .mockImplementation(() => {
          return { query: { id: 3, project_id: 1 } }
        })

      await act(async () => render(<DeveloperDetail />))
    })

    afterEach(() => {
      getDeveloperInfoSpy.mockClear()
      getDeveloperIconSpy.mockClear()
      routerSpy.mockClear()
    })

    afterAll(() => {
      getDeveloperInfoSpy.mockRestore()
      getDeveloperIconSpy.mockRestore()
      routerSpy.mockRestore()
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

    it('should call getDeveloperInfo() once', () => {
      expect(getDeveloperInfoSpy).toHaveBeenCalledTimes(1)
    })

    it('should call getDeveloperIcon() once', () => {
      expect(getDeveloperIconSpy).toHaveBeenCalledTimes(1)
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
