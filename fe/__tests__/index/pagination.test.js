require('dotenv').config()
import { render, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import Router from 'next/router'
import Cookies from 'js-cookie'

import Home from '@/src/pages/index'
import testData from '../constants/testData.json'
import { getProjects, deleteProject } from '@/src/api/providerApi'

// test
jest.mock('next/router', () => {
  return {
    route: '/',
    pathname: '',
    query: {
      filterProviderName: '',
      searchProvider: '',
      page: '',
    },
    push: jest.fn(),
  }
})
jest.mock('@/src/api/providerApi')
jest.mock('js-cookie', () => ({
  get: jest.fn(),
  setMockImplementation: jest.fn(),
  remove: jest.fn(),
}))

describe('When rendering home page', () => {
  beforeAll(() => {
    getProjects.mockImplementation(() => {
      return Promise.resolve().then(() => {
        return { data: testData.projects }
      })
    })
    deleteProject.mockImplementation(() => {
      return Promise.resolve().then(() => {
        return { data: testData.projects[0] }
      })
    })

    Cookies.get.mockReturnValueOnce(
      JSON.stringify({
        user_signed: {
          email: 'joshua.escarilla@sun-asterisk.com',
          google_id: '109434756611345923855',
          token_id: 'eyJhbGciOiJSU',
        },
      })
    )
  })

  describe('When using pagination', () => {
    const record = testData.projects

    it('should display nine buttons if total pages is seven (including the next and prev button)', async () => {
      getProjects.mockImplementation(() => {
        return Promise.resolve().then(() => {
          return { data: { ...record, total_pages: 7 } }
        })
      })

      await act(async () => render(<Home />))

      const pagination = await screen.getByRole('pagination')
      const pageItems = pagination.querySelectorAll(
        '.mantine-Pagination-item:not(.mantine-Pagination-dots)'
      )
      expect(pageItems).toHaveLength(9)
    })

    it('should display eight buttons if total pages is greater than seven (including the next and prev button)', async () => {
      getProjects.mockImplementation(() => {
        return Promise.resolve().then(() => {
          return { data: { ...record, total_pages: 10 } }
        })
      })
      await act(async () => render(<Home />))

      const pagination = await screen.getByRole('pagination')
      const pageItems = pagination.querySelectorAll(
        '.mantine-Pagination-item:not(.mantine-Pagination-dots)'
      )
      expect(pageItems).toHaveLength(8)

      const ellipsis = pagination.querySelector('.mantine-Pagination-dots')
      expect(ellipsis).toBeInTheDocument()
    })

    describe('when clicking page two button', () => {
      let routerSpy, pagination, funcCalled

      beforeAll(async () => {
        getProjects.mockImplementation(() => {
          return Promise.resolve().then(() => {
            return { data: { ...record, page: '2', total_pages: 7 } }
          })
        })

        await act(async () => render(<Home />))

        routerSpy = jest.spyOn(Router, 'push')
        pagination = await screen.getByRole('pagination')

        const pageItems = pagination.querySelectorAll(
          '.mantine-Pagination-item:not(.mantine-Pagination-dots)'
        )
        userEvent.click(pageItems[2])
      })

      it('should update url when clicking any of the page buttons', async () => {
        expect(routerSpy).toHaveBeenCalledWith({
          pathname: '/',
          query: {
            ...Router.query,
            page: 2,
          },
        })
      })
    })
  })
})
