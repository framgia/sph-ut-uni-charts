import { rest } from 'msw'
import BacklogService from '../../services/BacklogService'
import { server } from '../../../jest.setup'

import testData from '../constants/issueTestData.json'

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

describe('Using getIssues() function', () => {
  describe('Should fetch issues from backlog API', () => {
    test('Correct namespace, project ID and key', async () => {
      // set up the server
      server.use(
        rest.get('*/api/v2/issues', (req, res, ctx) => {
          return res(ctx.json(testData.backlogServiceIssueResponse))
        })
      )

      // call the service
      const issues: any = await backlogService.getIssues('namespace', 'key', 111)

      expect(JSON.stringify(issues)).toBe(JSON.stringify(testData.backlogServiceIssueResponse))
    })

    test('Incorrect key', async () => {
      const errors = [
        {
          message: 'Authentication failure.',
          code: 11,
          moreInfo: ''
        }
      ]
      // set up the server
      server.use(
        rest.get('*/api/v2/issues', (req, res, ctx) => {
          return res(ctx.json(errors), ctx.status(401))
        })
      )

      // call the service
      const issues: any = await backlogService.getIssues('namespace', 'key', 111)

      expect(issues.status).toBe(401)
      expect(JSON.stringify(issues.errors)).toBe(JSON.stringify(errors))
    })

    test('Incorrect project ID', async () => {
      const errors = [{ message: 'No such project. (key:111)', code: 6, moreInfo: '' }]
      // set up the server
      server.use(
        rest.get('*/api/v2/issues', (req, res, ctx) => {
          return res(ctx.json(errors), ctx.status(404))
        })
      )

      // call the service
      const issues: any = await backlogService.getIssues('namespace', 'key', 111)

      expect(issues.status).toBe(404)
      expect(JSON.stringify(issues.errors)).toBe(JSON.stringify(errors))
    })

    test('Incorrect namespace', async () => {
      // set up the server
      server.use(
        rest.get('*/api/v2/issues', (req, res, ctx) => {
          return res(ctx.status(404))
        })
      )

      // call the service
      const issues: any = await backlogService.getIssues('namespace', 'key', 111)

      expect(issues.status).toBe(404)
    })
  })
})

describe('Using getMilestones() function', () => {
  /*
  Had to setup the server for each test instead of calling beforeAll/beforeEach
  because it has different parameters
  */
  describe('Should fetch milestones from backlog API', () => {
    test('Correct namespace, project ID and key', async () => {
      // set up the server
      server.use(
        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.json(testData.backlogServiceMilestoneResponse))
        })
      )

      // call the service
      const milestones: any = await backlogService.getMilestones('namespace', 'key', 111)

      expect(JSON.stringify(milestones)).toBe(
        JSON.stringify(testData.backlogServiceMilestoneResponse)
      )
    })

    test('Incorrect key', async () => {
      const errors = [
        {
          message: 'Authentication failure.',
          code: 11,
          moreInfo: ''
        }
      ]
      // set up the server
      server.use(
        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.json(errors), ctx.status(401))
        })
      )

      // call the service
      const issues: any = await backlogService.getMilestones('namespace', 'key', 111)

      expect(issues.status).toBe(401)
      expect(JSON.stringify(issues.errors)).toBe(JSON.stringify(errors))
    })

    test('Incorrect project ID', async () => {
      const errors = [{ message: 'No such project. (key:111)', code: 6, moreInfo: '' }]
      // set up the server
      server.use(
        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.json(errors), ctx.status(404))
        })
      )

      // call the service
      const issues: any = await backlogService.getMilestones('namespace', 'key', 111)

      expect(issues.status).toBe(404)
      expect(JSON.stringify(issues.errors)).toBe(JSON.stringify(errors))
    })

    test('Incorrect namespace', async () => {
      // set up the server
      server.use(
        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.status(404))
        })
      )

      // call the service
      const issues: any = await backlogService.getMilestones('namespace', 'key', 111)

      expect(issues.status).toBe(404)
    })
  })
})
