import { rest } from 'msw'
import BacklogService from '../../services/BacklogService'
import { server } from '../../../jest.setup'

import issueTestData from '../constants/issueTestData.json'
import projectTestData from '../constants/projectTestData.json'

const backlogService = new BacklogService()

describe('When using getProjectById() function', () => {
  let project: any

  beforeEach(() => {
    server.use(
      rest.get('*/users/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ user_id: 1 }))
      })
    )
  })

  describe('if ID exist in the database', () => {
    beforeEach(async () => {
      server.use(
        rest.get('*/api/projects/*', (req, res, ctx) => {
          return res(ctx.json(projectTestData.sampleProject))
        })
      )

      project = await backlogService.getProjectById('/1', { user_id: 1 })
    })

    it('should return expected body', () => {
      expect(project).toHaveProperty('id')
    })
  })

  describe('if ID does not exist in the database', () => {
    beforeEach(async () => {
      server.use(
        rest.get('*/api/projects/*', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ message: 'No Data Found' }))
        })
      )

      project = await backlogService.getProjectById('/1', { user_id: 1 })
    })

    it('should return status of 404', () => {
      expect(project.status).toBe(404)
    })

    it("should have 'No Data Found' as error message", () => {
      expect(project.errors).toHaveProperty('message', 'No Data Found')
    })
  })

  describe('if invalid ID, non numeric is invalid', () => {
    beforeEach(async () => {
      server.use(
        rest.get('*/api/projects/*', (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ message: 'Invalid ID' }))
        })
      )

      project = await backlogService.getProjectById('/1', { user_id: 1 })
    })

    it('should return status of 400', () => {
      expect(project.status).toBe(400)
    })

    it("should have 'No Data Found' as error message", () => {
      expect(project.errors).toHaveProperty('message', 'Invalid ID')
    })
  })
})

describe('Backlog Service Test Suite', () => {
  test('Test #4: getProjects - fetch all projects', async () => {
    const projects: any = await backlogService.getProjects()
    if (!projects.length) expect(projects).toStrictEqual([])
    else expect(projects[0]).toHaveProperty('id')
  })
})

describe('When using deleteProjectById() function', () => {
  let project: any

  describe('if delete is successful', () => {
    it('should return the project details', async () => {
      server.use(
        rest.delete('*/api/projects/*', (req, res, ctx) => {
          return res(ctx.json(projectTestData.sampleProject))
        })
      )

      project = await backlogService.deleteProjectById('/11', { user_id: 1 })

      expect(JSON.stringify(project)).toBe(JSON.stringify(projectTestData.sampleProject))
    })
  })

  describe('if ID does not exist', () => {
    beforeEach(async () => {
      server.use(
        rest.delete('*/api/projects/*', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ message: 'ID does not exist' }))
        })
      )

      project = await backlogService.deleteProjectById('/1', { user_id: 1 })
    })

    it('should return the status of 404', () => {
      expect(project.status).toBe(404)
    })

    it('should return the error messages', () => {
      expect(project).toHaveProperty('errors')
      expect(JSON.stringify(project.errors)).toBe(JSON.stringify({ message: 'ID does not exist' }))
    })
  })

  describe('if ID is not a number', () => {
    beforeEach(async () => {
      server.use(
        rest.delete('*/api/projects/*', (req, res, ctx) => {
          return res(ctx.status(400), ctx.json({ message: 'Invalid ID' }))
        })
      )

      project = await backlogService.deleteProjectById('/test', { user_id: 1 })
    })

    it('should return the status of 400', () => {
      expect(project.status).toBe(400)
    })

    it('should return the error messages', () => {
      expect(project).toHaveProperty('errors')
      expect(JSON.stringify(project.errors)).toBe(JSON.stringify({ message: 'Invalid ID' }))
    })
  })
})

describe('When using getIssues() function', () => {
  let issues: any

  describe('if it has correct namespace, project ID and key', () => {
    it('should return expected body', async () => {
      server.use(
        rest.get('*/api/v2/issues', (req, res, ctx) => {
          return res(ctx.json(issueTestData.backlogServiceIssueResponse))
        })
      )

      issues = await backlogService.getIssues('namespace', 'key', 111)

      expect(JSON.stringify(issues)).toBe(JSON.stringify(issueTestData.backlogServiceIssueResponse))
    })
  })

  describe('if it has incorrect key', () => {
    const errors = [
      {
        message: 'Authentication failure.',
        code: 11,
        moreInfo: ''
      }
    ]

    beforeEach(async () => {
      server.use(
        rest.get('*/api/v2/issues', (req, res, ctx) => {
          return res(ctx.json(errors), ctx.status(401))
        })
      )

      issues = await backlogService.getIssues('namespace', 'key', 111)
    })

    it('should return status of 401', () => {
      expect(issues.status).toBe(401)
      expect(JSON.stringify(issues.errors)).toBe(JSON.stringify(errors))
    })

    it('should return expected error message', () => {
      expect(JSON.stringify(issues.errors)).toBe(JSON.stringify(errors))
    })
  })

  describe('if it has incorrect project ID', () => {
    const errors = [{ message: 'No such project. (key:111)', code: 6, moreInfo: '' }]

    beforeEach(async () => {
      server.use(
        rest.get('*/api/v2/issues', (req, res, ctx) => {
          return res(ctx.json(errors), ctx.status(404))
        })
      )

      issues = await backlogService.getIssues('namespace', 'key', 111)
    })

    it('should return status of 404', () => {
      expect(issues.status).toBe(404)
    })

    it('should return expected error message', () => {
      expect(JSON.stringify(issues.errors)).toBe(JSON.stringify(errors))
    })
  })

  describe('if it has incorrect namespace', () => {
    beforeEach(async () => {
      server.use(
        rest.get('*/api/v2/issues', (req, res, ctx) => {
          return res(ctx.status(404))
        })
      )

      issues = await backlogService.getIssues('namespace', 'key', 111)
    })

    it('should return status of 404', () => {
      expect(issues.status).toBe(404)
    })

    it('should not return an error message', () => {
      expect(issues).toHaveProperty('errors', '')
    })
  })
})

describe('When using getMilestones() function', () => {
  let milestones: any

  describe('if it has correct namespace, project ID and key', () => {
    it('should return expected body', async () => {
      server.use(
        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.json(issueTestData.backlogServiceMilestoneResponse))
        })
      )

      milestones = await backlogService.getMilestones('namespace', 'key', 111)

      expect(JSON.stringify(milestones)).toBe(
        JSON.stringify(issueTestData.backlogServiceMilestoneResponse)
      )
    })
  })

  describe('if it has incorrect key', () => {
    const errors = [
      {
        message: 'Authentication failure.',
        code: 11,
        moreInfo: ''
      }
    ]

    beforeEach(async () => {
      server.use(
        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.json(errors), ctx.status(401))
        })
      )

      milestones = await backlogService.getMilestones('namespace', 'key', 111)
    })

    it('should return status of 401', () => {
      expect(milestones.status).toBe(401)
    })

    it('should return expected error message', () => {
      expect(JSON.stringify(milestones.errors)).toBe(JSON.stringify(errors))
    })
  })

  describe('if it has incorrect project ID', () => {
    const errors = [{ message: 'No such project. (key:111)', code: 6, moreInfo: '' }]

    beforeEach(async () => {
      server.use(
        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.json(errors), ctx.status(404))
        })
      )

      milestones = await backlogService.getMilestones('namespace', 'key', 111)
    })

    it('should return status of 404', () => {
      expect(milestones.status).toBe(404)
    })

    it('should return expected error message', () => {
      expect(JSON.stringify(milestones.errors)).toBe(JSON.stringify(errors))
    })
  })

  describe('if it has incorrect namespace', () => {
    beforeEach(async () => {
      server.use(
        rest.get('*/api/v2/projects/*', (req, res, ctx) => {
          return res(ctx.status(404))
        })
      )

      milestones = await backlogService.getMilestones('namespace', 'key', 111)
    })

    it('should return status of 404', () => {
      expect(milestones.status).toBe(404)
    })

    it('should not return an error message', () => {
      expect(milestones).toHaveProperty('errors', '')
    })
  })
})
