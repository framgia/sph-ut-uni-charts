import { rest } from 'msw'
import { setupServer } from 'msw/node'
import BacklogService from '../../services/BacklogService'

import { backlogServiceIssueResponse, backlogServiceMilestoneResponse } from '../../utils/constants'

const backlogService = new BacklogService()

describe('Backlog Service Test Suite', () => {
  test('Test #1: getProjectById - if ID exist in the database', async () => {
    const projects: any = await backlogService.getProjects()

    if (!projects.length) {
      expect(projects).toStrictEqual([])
    } else {
      const project: any = await backlogService.getProjectById(`/${projects[0].id}`)
      expect(project).toHaveProperty('id')
    }
  })

  test('Test #2: getProjectById - if ID does not exist in the database', async () => {
    const project: any = await backlogService.getProjectById('/111111')
    expect(project).toHaveProperty('message', 'No Data Found')
  })

  test('Test #3: getProjectById - invalid ID, letters are not valid', async () => {
    const project: any = await backlogService.getProjectById('/test')
    expect(project).toHaveProperty('message', 'Invalid ID')
  })

  test('Test #4: getProjects - fetch all projects', async () => {
    const projects: any = await backlogService.getProjects()
    if (!projects.length) expect(projects).toStrictEqual([])
    else expect(projects[0]).toHaveProperty('id')
  })

  test('Test #5: deleteProjectById - if ID does not exist in the database', async () => {
    const project: any = await backlogService.deleteProjectById('/111111')
    expect(project).toHaveProperty('message', 'ID does not exist')
  })

  test('Test #6: deleteProjectById - invalid ID, letters are not valid, should be number', async () => {
    const project: any = await backlogService.deleteProjectById('/test')
    expect(project).toHaveProperty('message', 'Invalid ID')
  })

})

describe('getIssues() service', () => {
  /*
  Had to setup the server for each test instead of calling beforeAll/beforeEach
  because it has different parameters
  */
  it('should return 200 and response details when correct namespace project and key', async () => {
    // set up the server
    const server = setupServer(
      ...[
        rest.get('*/api/v2/issues', (req, res, ctx) => {
          return res(ctx.json(backlogServiceIssueResponse))
        })
      ]
    )
    server.listen({
      onUnhandledRequest: 'bypass'
    })

    // call the service
    const issues: any = await backlogService.getIssues('namespace', 'key', 111)

    expect(JSON.stringify(issues)).toBe(JSON.stringify(backlogServiceIssueResponse))
    server.close()
  })

  it('should return 401 and error details when incorrect key', async () => {
    const errors = [
      {
        message: 'Authentication failure.',
        code: 11,
        moreInfo: ''
      }
    ]
    // set up the server
    const server = setupServer(
      ...[
        rest.get('*/api/v2/issues', (req, res, ctx) => {
          return res(ctx.json(errors), ctx.status(401))
        })
      ]
    )
    server.listen({
      onUnhandledRequest: 'bypass'
    })

    // call the service
    const issues: any = await backlogService.getIssues('namespace', 'key', 111)

    expect(issues.status).toBe(401)
    expect(JSON.stringify(issues.errors)).toBe(JSON.stringify(errors))
    server.close()
  })

  it('should return 404 and error details when incorrect project id', async () => {
    const errors = [{ message: 'No such project. (key:111)', code: 6, moreInfo: '' }]
    // set up the server
    const server = setupServer(
      ...[
        rest.get('*/api/v2/issues', (req, res, ctx) => {
          return res(ctx.json(errors), ctx.status(404))
        })
      ]
    )
    server.listen({
      onUnhandledRequest: 'bypass'
    })

    // call the service
    const issues: any = await backlogService.getIssues('namespace', 'key', 111)

    expect(issues.status).toBe(404)
    expect(JSON.stringify(issues.errors)).toBe(JSON.stringify(errors))
    server.close()
  })

  it('should return 404 when incorrect namespace', async () => {
    // set up the server
    const server = setupServer(
      ...[
        rest.get('*/api/v2/issues', (req, res, ctx) => {
          return res(ctx.status(404))
        })
      ]
    )
    server.listen({
      onUnhandledRequest: 'bypass'
    })

    // call the service
    const issues: any = await backlogService.getIssues('namespace', 'key', 111)

    expect(issues.status).toBe(404)
    server.close()
  })
})

describe('getMilestones() service', () => {
  /*
  Had to setup the server for each test instead of calling beforeAll/beforeEach
  because it has different parameters
  */
  it('should return 200 and response details when correct namespace project and key', async () => {
    // set up the server
    const server = setupServer(
      ...[
        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.json(backlogServiceMilestoneResponse))
        })
      ]
    )
    server.listen({
      onUnhandledRequest: 'bypass'
    })

    // call the service
    const milestones: any = await backlogService.getMilestones('namespace', 'key', 111)

    expect(JSON.stringify(milestones)).toBe(JSON.stringify(backlogServiceMilestoneResponse))
    server.close()
  })

  it('should return 401 and error details when incorrect key', async () => {
    const errors = [
      {
        message: 'Authentication failure.',
        code: 11,
        moreInfo: ''
      }
    ]
    // set up the server
    const server = setupServer(
      ...[
        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.json(errors), ctx.status(401))
        })
      ]
    )
    server.listen({
      onUnhandledRequest: 'bypass'
    })

    // call the service
    const issues: any = await backlogService.getMilestones('namespace', 'key', 111)

    expect(issues.status).toBe(401)
    expect(JSON.stringify(issues.errors)).toBe(JSON.stringify(errors))
    server.close()
  })

  it('should return 404 and error details when incorrect project id', async () => {
    const errors = [{ message: 'No such project. (key:111)', code: 6, moreInfo: '' }]
    // set up the server
    const server = setupServer(
      ...[
        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.json(errors), ctx.status(404))
        })
      ]
    )
    server.listen({
      onUnhandledRequest: 'bypass'
    })

    // call the service
    const issues: any = await backlogService.getMilestones('namespace', 'key', 111)

    expect(issues.status).toBe(404)
    expect(JSON.stringify(issues.errors)).toBe(JSON.stringify(errors))
    server.close()
  })

  it('should return 404 when incorrect namespace', async () => {
    // set up the server
    const server = setupServer(
      ...[
        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.status(404))
        })
      ]
    )
    server.listen({
      onUnhandledRequest: 'bypass'
    })

    // call the service
    const issues: any = await backlogService.getMilestones('namespace', 'key', 111)

    expect(issues.status).toBe(404)
    server.close()
  })
})
