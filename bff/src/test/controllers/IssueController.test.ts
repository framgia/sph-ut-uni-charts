import { rest } from 'msw'
import httpMocks from 'node-mocks-http'
import { Request } from 'express'
import { server } from '../../../jest.setup'

import testData from '../constants/issueTestData.json'
import IssueController from '../../controllers/IssueController'
import { CustomTypedResponse } from '../../utils/interfaces'

const issueController = new IssueController()

describe('When using getIssues() function', () => {
  let request: Request
  let response: CustomTypedResponse

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
      }),

      rest.get('*/users/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ id: 1 }))
      })
    )
  })

  describe('if ID exists, has milestone and issues', () => {
    beforeEach(async () => {
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

      await issueController.getIssues(request, response)
    })

    it('should return status of 200', () => {
      expect(response.statusCode).toBe(200)
    })

    it('should return the expected body', () => {
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
    beforeEach(async () => {
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

      await issueController.getIssues(request, response)
    })

    it('should return status of 400', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return expected error message', () => {
      const data = response._getData()

      expect(JSON.parse(data)).toHaveProperty('message', 'Service information not provided.')
    })
  })

  describe('if ID is not a number', () => {
    beforeEach(async () => {
      server.use(
        rest.get('*/api/projects/:id', (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ message: 'Invalid ID' }))
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

      await issueController.getIssues(request, response)
    })

    it('should return a status of 400', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return the expected error message', () => {
      const data = response._getData()

      expect(JSON.parse(data)).toHaveProperty('message', 'Invalid ID')
    })
  })

  describe('if project with provided ID does not exist', () => {
    beforeEach(async () => {
      server.use(
        rest.get('*/api/projects/:id', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ message: 'No Data Found' }))
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

      await issueController.getIssues(request, response)
    })

    it('should return status of 404', () => {
      expect(response.statusCode).toBe(404)
    })

    it('should return expected error message', () => {
      const data = response._getData()

      expect(JSON.parse(data)).toHaveProperty('message', 'No Data Found')
    })
  })

  describe('if fetched provider ID is not a number', () => {
    beforeEach(async () => {
      server.use(
        rest.get('*/api/providers/:id', (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ message: 'Invalid ID' }))
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

      await issueController.getIssues(request, response)
    })

    it('should return a status of 400', () => {
      expect(response.statusCode).toBe(400)
    })

    it('should return the expected error message', () => {
      const data = response._getData()

      expect(JSON.parse(data)).toHaveProperty('message', 'Invalid ID')
    })
  })

  describe('if provider with fetched ID does not exist', () => {
    beforeEach(async () => {
      server.use(
        rest.get('*/api/providers/:id', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ message: 'No Data Found' }))
        })
      )

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/issues/:id',
        params: {
          id: '1'
        },
        query: {
          service: 'backlog'
        }
      })
      response = httpMocks.createResponse()

      await issueController.getIssues(request, response)
    })

    it('should return status of 404', () => {
      expect(response.statusCode).toBe(404)
    })

    it('should return expected error message', () => {
      const data = response._getData()

      expect(JSON.parse(data)).toHaveProperty('message', 'No Data Found')
    })
  })

  describe('if there is an error when fetching the milestones', () => {
    const apiResponse = {
      errors: [
        {
          message: 'No such project. (key:1)',
          code: 6,
          moreInfo: ''
        }
      ]
    }

    beforeEach(async () => {
      server.use(
        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json(apiResponse))
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

      await issueController.getIssues(request, response)
    })

    it('should return same status as the api response', () => {
      expect(response.statusCode).toBe(404)
    })

    it('should return expected body', () => {
      const data = response._getJSONData()
      expect(JSON.stringify(data)).toBe(JSON.stringify(apiResponse))
    })
  })

  describe('if there is an error when fetching the issues', () => {
    const apiResponse = {
      errors: [
        {
          message: 'Authentication failure.',
          code: 11,
          moreInfo: ''
        }
      ]
    }

    beforeEach(async () => {
      server.use(
        rest.get('*/api/v2/issues', (req, res, ctx) => {
          return res(ctx.status(401), ctx.json(apiResponse))
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

      await issueController.getIssues(request, response)
    })

    it('should return same status as the api response', () => {
      expect(response.statusCode).toBe(401)
    })

    it('should return expected body', () => {
      const data = response._getJSONData()
      expect(JSON.stringify(data)).toBe(JSON.stringify(apiResponse))
    })
  })

  describe('if project and provider exists in the service provided', () => {
    describe('if it has no issues', () => {
      const expectedResponse = [
        { milestone: 'Sprint 3', issues: [] },
        { milestone: 'Sprint 2', issues: [] },
        { milestone: 'Sprint 1', issues: [] }
      ]

      beforeEach(async () => {
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

        await issueController.getIssues(request, response)
      })

      it('should return status of 200', () => {
        expect(response.statusCode).toBe(200)
      })

      it('should return expected body', () => {
        const data = response._getData()

        expect(JSON.stringify(data)).toBe(JSON.stringify(expectedResponse))
      })
    })

    describe('if it has no milestone', () => {
      beforeEach(async () => {
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

        await issueController.getIssues(request, response)
      })

      it('should return status of 200', () => {
        expect(response.statusCode).toBe(200)
      })

      it('should return expected body', () => {
        const data = response._getData()

        expect(JSON.stringify(data)).toBe(JSON.stringify([]))
      })
    })
  })
})
