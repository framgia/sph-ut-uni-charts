import { rest } from 'msw'
import { setupServer } from 'msw/node'
import httpMocks from 'node-mocks-http'

import IssueController from '../../controllers/IssueController'
import BacklogService from '../../services/BacklogService'

const backlogService = new BacklogService()
const issueController = new IssueController()

const issuesResponse = [
  {
    id: 111,
    status: {
      name: 'Closed'
    },
    estimatedHours: 5,
    actualHours: 3
  },
  {
    id: 222,
    status: {
      name: 'Open'
    },
    estimatedHours: 5,
    actualHours: 3
  },
  {
    id: 333
  }
]

const milestonesResponse = [
  {
    id: 111,
    name: 'Sprint 3'
  },
  {
    id: 222,
    name: 'Sprint 2'
  },
  {
    id: 333,
    name: 'Sprint 1'
  }
]

const server = setupServer(
  ...[
    rest.get('*/api/v2/issues', (req, res, ctx) => {
      return res(ctx.json(issuesResponse))
    }),

    rest.get('*/api/v2/projects/*', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(milestonesResponse))
    })
  ]
)

const emptyIssuesServer = setupServer(
  ...[
    rest.get('*/api/v2/issues', (req, res, ctx) => {
      return res(ctx.json([]))
    }),

    rest.get('*/api/v2/projects/*', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(milestonesResponse))
    })
  ]
)

const emptyServer = setupServer(
  ...[
    rest.get('*/api/v2/issues', (req, res, ctx) => {
      return res(ctx.json([]))
    }),

    rest.get('*/api/v2/projects/*', (req, res, ctx) => {
      return res(ctx.status(200), ctx.json([]))
    })
  ]
)

describe('has issues and milestones', () => {
  /*
  NOTE:
  set unhandled request to bypass
  since we are not mocking requests to services and it is raising warnings
  removing it will not break the code, it just looks cleaner in terminal this way
  */

  beforeAll(() =>
    server.listen({
      onUnhandledRequest: 'bypass'
    })
  )
  afterAll(() => server.close())

  it('should return 200 and issue details when id exists', async () => {
    const projects: any = await backlogService.getProjects()

    if (!projects.length) {
      expect(projects).toStrictEqual([])
    } else {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/issues/:id',
        params: {
          id: `${projects[0].id}`
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
    }
  })

  it('should return 404 and error details when id does not exist', async () => {
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

  it('should return 400 and error details when id is not number', async () => {
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

  it('should return 400 and error details when incorrect service ', async () => {
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
})

it('should return 200 and milestone details when id is correct and no issues found', async () => {
  emptyIssuesServer.listen({
    onUnhandledRequest: 'bypass'
  })

  const projects: any = await backlogService.getProjects()

  if (!projects.length) {
    expect(projects).toStrictEqual([])
  } else {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/issues/:id',
      params: {
        id: `${projects[0].id}`
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

    emptyIssuesServer.close()
  }
})

it('should return 200 and empty array when id is correct and no milestones found', async () => {
  emptyServer.listen({
    onUnhandledRequest: 'bypass'
  })

  const projects: any = await backlogService.getProjects()

  if (!projects.length) {
    expect(projects).toStrictEqual([])
  } else {
    const request = httpMocks.createRequest({
      method: 'GET',
      url: '/issues/:id',
      params: {
        id: `${projects[0].id}`
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

    emptyServer.close()
  }
})
