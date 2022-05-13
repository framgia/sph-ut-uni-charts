import { rest } from 'msw'
import httpMocks from 'node-mocks-http'
import { Request, Response } from 'express'
import { server } from '../../../jest.setup'

import testData from '../constants/issueTestData.json'
import IssueController from '../../controllers/IssueController'

const issueController = new IssueController()

describe('When using getIssues() function', () => {
  interface TypedResponse extends Response {
    statusCode: any
    _getData: () => any
  }

  let request: Request
  let response: TypedResponse

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

  describe('if ID exists, has milestone and issues', () => {
    beforeEach(() => {
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/issues/:id',
        params: {
          id: 111
        },
        query: {
          service: 'backlog'
        }
      })

      response = httpMocks.createResponse()
    })

    it('should return status of 200', async () => {
      await issueController.getIssues(request, response)

      expect(response.statusCode).toBe(200)
    })

    it('should return the expected body', async () => {
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

      expect(JSON.stringify(data)).toBe(JSON.stringify(expectedResponse))
    })
  })

  describe('if incorrect service is provided', () => {
    beforeEach(() => {
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/issues/:id',
        params: {
          id: '111'
        },
        query: {
          service: 'it'
        }
      })
      response = httpMocks.createResponse()
    })

    it('should return status of 400', async () => {
      await issueController.getIssues(request, response)

      expect(response.statusCode).toBe(400)
    })

    it('should return expected error message', async () => {
      await issueController.getIssues(request, response)
      const data = response._getData()

      expect(JSON.parse(data)).toHaveProperty('message', 'Service information not provided.')
    })
  })

  describe('if ID is not a number', () => {
    beforeEach(() => {
      server.use(
        rest.get('*/api/projects/:id', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ message: 'Invalid ID' }))
        })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/issues/:id',
        params: {
          id: 'test'
        },
        query: {
          service: 'backlog'
        }
      })
      response = httpMocks.createResponse()
    })

    it('should return a status of 400', async () => {
      await issueController.getIssues(request, response)

      expect(response.statusCode).toBe(400)
    })

    it('should return the expected error message', async () => {
      await issueController.getIssues(request, response)
      const data = response._getData()

      expect(JSON.parse(data)).toHaveProperty('message', 'Invalid ID')
    })
  })

  describe('if project with provided ID does not exist', () => {
    beforeEach(() => {
      server.use(
        rest.get('*/api/projects/:id', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ message: 'No Data Found' }))
        })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/issues/:id',
        params: {
          id: '999999'
        },
        query: {
          service: 'backlog'
        }
      })
      response = httpMocks.createResponse()
    })

    it('should return status of 404', async () => {
      await issueController.getIssues(request, response)

      expect(response.statusCode).toBe(404)
    })

    it('should return expected error message', async () => {
      await issueController.getIssues(request, response)
      const data = response._getData()

      expect(JSON.parse(data)).toHaveProperty('message', 'No Data Found')
    })
  })

  describe('if ID exists, has no issues', () => {
    const expectedResponse = [
      { milestone: 'Sprint 3', issues: [] },
      { milestone: 'Sprint 2', issues: [] },
      { milestone: 'Sprint 1', issues: [] }
    ]

    beforeEach(() => {
      server.use(
        rest.get('*/api/v2/issues', (req, res, ctx) => {
          return res(ctx.json([]))
        }),

        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(testData.milestonesResponse))
        })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/issues/:id',
        params: {
          id: 111
        },
        query: {
          service: 'backlog'
        }
      })

      response = httpMocks.createResponse()
    })

    it('should return status of 200', async () => {
      await issueController.getIssues(request, response)

      expect(response.statusCode).toBe(200)
    })

    it('should return expected body', async () => {
      await issueController.getIssues(request, response)
      const data = response._getData()

      expect(JSON.stringify(data)).toBe(JSON.stringify(expectedResponse))
    })
  })

  describe('if ID exists, has no milestone', () => {
    beforeEach(() => {
      server.use(
        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json([]))
        })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/issues/:id',
        params: {
          id: 111
        },
        query: {
          service: 'backlog'
        }
      })

      response = httpMocks.createResponse()
    })

    it('should return status of 200', async () => {
      await issueController.getIssues(request, response)

      expect(response.statusCode).toBe(200)
    })

    it('should return expected body', async () => {
      await issueController.getIssues(request, response)
      const data = response._getData()

      expect(JSON.stringify(data)).toBe(JSON.stringify([]))
    })
  })
})
