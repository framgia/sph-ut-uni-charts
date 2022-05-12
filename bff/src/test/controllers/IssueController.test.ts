import { rest } from 'msw'
import httpMocks from 'node-mocks-http'
import { server } from '../../../jest.setup'

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

const providersResponse = {
  id: 1,
  user_id: 0,
  name: 'name',
  space_key: 'space_key',
  api_key: 'api_key',
  created_at: '2022-05-11T09:39:26.685Z',
  updated_at: '2022-05-11T09:39:15.966Z',
  projects: []
}

const projectsResponse = {
  id: 1,
  name: 'name',
  key: 'key',
  project_id: 1,
  provider_id: 1,
  created_at: '2022-05-11T09:39:48.439Z',
  updated_at: '2022-05-11T09:39:29.786Z'
}

describe('getIssues()', () => {
  beforeEach(() => {
    server.use(
      rest.get('*/api/v2/issues', (req, res, ctx) => {
        return res(ctx.json(issuesResponse))
      }),

      rest.get('*/api/v2/projects/*', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(milestonesResponse))
      }),

      rest.get('*/api/providers/:id', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(providersResponse))
      }),

      rest.get('*/api/projects/:id', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(projectsResponse))
      })
    )
  })

  it('should return 200 and issue details when id exists', async () => {
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

  it('should return 400 and error details when id is not number', async () => {
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

  it('should return 404 and error details when id does not exist', async () => {
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

  it('should return 200 and milestone details when id is correct and no issues found', async () => {
    server.use(
      rest.get('*/api/v2/issues', (req, res, ctx) => {
        return res(ctx.json([]))
      }),

      rest.get('*/api/v2/projects/*', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(milestonesResponse))
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

  it('should return 200 and empty array when id is correct and no milestones found', async () => {
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
