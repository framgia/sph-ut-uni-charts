import { rest } from 'msw'
import httpMocks from 'node-mocks-http'
import { server } from '../../../jest.setup'

import testData from '../constants/issueTestData.json'
import IssueController from '../../controllers/IssueController'

const issueController = new IssueController()

describe('Using getIssues() function', () => {
  beforeEach(() => {
    server.use(
      rest.get('*/api/v2/issues', (req, res, ctx) => {
        return res(ctx.json(testData.issuesResponse))
      }),

      rest.get('*/api/v2/projects/*', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(testData.milestonesResponse))
      }),

      rest.get('*/api/providers/:id', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(testData.providersResponse))
      }),

      rest.get('*/api/projects/:id', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(testData.projectsResponse))
      })
    )
  })

  describe('Should fetch the issues', () => {
    test('ID exists, has milestone and issues', async () => {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/issues/:id',
        params: {
          id: 111
        },
        query: {
          service: 'backlog'
        }
      })

      const response = httpMocks.createResponse()
      await issueController.getIssues(request, response)
      const data = response._getData()

      const formattedIssue = [
        {
          id: 111,
          actualHours: 3,
          estimatedHours: 5,
          currentStatus: 'Closed'
        },
        {
          id: 222,
          actualHours: 3,
          estimatedHours: 5,
          currentStatus: 'Open'
        },
        {
          id: 333,
          actualHours: 0,
          estimatedHours: 0,
          currentStatus: 'Open'
        }
      ]

      const expectedResponse = [
        { milestone: 'Sprint 3', issues: formattedIssue },
        { milestone: 'Sprint 2', issues: formattedIssue },
        { milestone: 'Sprint 1', issues: formattedIssue }
      ]

      expect(response.statusCode).toBe(200)
      expect(JSON.stringify(data)).toBe(JSON.stringify(expectedResponse))
    })

    test('Incorrect service is provided', async () => {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/issues/:id',
        params: {
          id: '111'
        },
        query: {
          service: 'it'
        }
      })
      const response = httpMocks.createResponse()

      await issueController.getIssues(request, response)
      const data = response._getData()

      expect(response.statusCode).toBe(400)
      expect(JSON.parse(data)).toHaveProperty('message', 'Service information not provided.')
    })

    test('ID is not a number', async () => {
      server.use(
        rest.get('*/api/projects/:id', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ message: 'Invalid ID' }))
        })
      )

      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/issues/:id',
        params: {
          id: 'test'
        },
        query: {
          service: 'backlog'
        }
      })
      const response = httpMocks.createResponse()

      await issueController.getIssues(request, response)
      const data = response._getData()

      expect(response.statusCode).toBe(400)
      expect(JSON.parse(data)).toHaveProperty('message', 'Invalid ID')
    })

    test('Project with provided ID does not exist', async () => {
      server.use(
        rest.get('*/api/projects/:id', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ message: 'No Data Found' }))
        })
      )

      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/issues/:id',
        params: {
          id: '999999'
        },
        query: {
          service: 'backlog'
        }
      })
      const response = httpMocks.createResponse()

      await issueController.getIssues(request, response)
      const data = response._getData()

      expect(response.statusCode).toBe(404)
      expect(JSON.parse(data)).toHaveProperty('message', 'No Data Found')
    })

    test('ID exists, has no issues', async () => {
      server.use(
        rest.get('*/api/v2/issues', (req, res, ctx) => {
          return res(ctx.json([]))
        }),

        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(testData.milestonesResponse))
        })
      )

      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/issues/:id',
        params: {
          id: 111
        },
        query: {
          service: 'backlog'
        }
      })

      const response = httpMocks.createResponse()
      await issueController.getIssues(request, response)
      const data = response._getData()

      const expectedResponse = [
        { milestone: 'Sprint 3', issues: [] },
        { milestone: 'Sprint 2', issues: [] },
        { milestone: 'Sprint 1', issues: [] }
      ]

      expect(response.statusCode).toBe(200)
      expect(JSON.stringify(data)).toBe(JSON.stringify(expectedResponse))
    })

    test('ID exists, has no milestone', async () => {
      server.use(
        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json([]))
        })
      )

      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/issues/:id',
        params: {
          id: 111
        },
        query: {
          service: 'backlog'
        }
      })

      const response = httpMocks.createResponse()
      await issueController.getIssues(request, response)
      const data = response._getData()

      expect(response.statusCode).toBe(200)
      expect(JSON.stringify(data)).toBe(JSON.stringify([]))
    })
  })
})
