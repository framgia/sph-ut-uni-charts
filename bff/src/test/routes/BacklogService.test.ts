import { rest } from 'msw'
import BacklogService from '../../services/BacklogService'
import { server } from '../../../jest.setup'

import issueTestData from '../constants/issueTestData.json'
import projectTestData from '../constants/projectTestData.json'

const backlogService = new BacklogService()

describe('When using getProjectById() function', () => {
  let project: any, message: any

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

      try {
        await backlogService.getProjectById('/1', { user_id: 1 })
      } catch (error: any) {
        project = JSON.parse(error.message)
      }
    })

    it('should throw an error with status of 404', () => {
      expect(project).toHaveProperty('status', 404)
    })

    it("should throw an error with 'No Data Found' as error message", () => {
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

      try {
        await backlogService.getProjectById('/1', { user_id: 1 })
      } catch (error: any) {
        project = JSON.parse(error.message)
      }
    })

    it('should throw an error with status of 400', () => {
      expect(project.status).toBe(400)
    })

    it("should throw an error with 'No Data Found' as error message", () => {
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

      try {
        await backlogService.deleteProjectById('/test', { user_id: 1 })
      } catch (error: any) {
        project = JSON.parse(error.message)
      }
    })

    it('should should throw an error withstatus of 404', () => {
      expect(project.status).toBe(404)
    })

    it('should should throw an error with "ID does not exist" as error message', () => {
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

      try {
        await backlogService.deleteProjectById('/test', { user_id: 1 })
      } catch (error: any) {
        project = JSON.parse(error.message)
      }
    })

    it('should should throw an error with status of 400', () => {
      expect(project.status).toBe(400)
    })

    it('should should throw an error with "Invalid ID" as error message', () => {
      expect(project).toHaveProperty('errors')
      expect(JSON.stringify(project.errors)).toBe(JSON.stringify({ message: 'Invalid ID' }))
    })
  })
})

describe('When using getIssues() function', () => {
  let issues: any

  describe('if it has correct namespace, and key', () => {
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
    const errors = {
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
          return res(ctx.json(errors), ctx.status(401))
        })
      )

      try {
        await backlogService.getIssues('namespace', 'key', 111)
      } catch (error: any) {
        issues = JSON.parse(error.message)
      }
    })

    it('should should throw an error with status of 401', () => {
      expect(issues.status).toBe(401)
      expect(JSON.stringify(issues.errors)).toBe(JSON.stringify(errors))
    })

    it('should should throw an error with expected error message', () => {
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

      try {
        await backlogService.getIssues('namespace', 'key', 111)
      } catch (error: any) {
        issues = JSON.parse(error.message)
      }
    })

    it('should should throw an error with status of 404', () => {
      expect(issues.status).toBe(404)
    })

    it('should should throw an error with `Incorrect namespace` as the error message', () => {
      expect(issues).toHaveProperty('errors', [{ message: 'Incorrect namespace' }])
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

      try {
        await backlogService.getMilestones('namespace', 'key', 111)
      } catch (error: any) {
        milestones = JSON.parse(error.message)
      }
    })

    it('should should throw an error with status of 401', () => {
      expect(milestones.status).toBe(401)
    })

    it('should should throw an error with expected error message', () => {
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

      try {
        await backlogService.getMilestones('namespace', 'key', 111)
      } catch (error: any) {
        milestones = JSON.parse(error.message)
      }
    })

    it('should should throw an error with status of 404', () => {
      expect(milestones.status).toBe(404)
    })

    it('should should throw an error with expected error message', () => {
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

      try {
        await backlogService.getMilestones('namespace', 'key', 111)
      } catch (error: any) {
        milestones = JSON.parse(error.message)
      }
    })

    it('should should throw an error with status of 404', () => {
      expect(milestones.status).toBe(404)
    })

    it('should should throw an error with no error message', () => {
      expect(milestones).toHaveProperty('errors', '')
    })
  })
})

describe('When using getActiveSprintData() function', () => {
  let issues: any

  describe('if it has correct namespace, project ID and key', () => {
    it('should return expected body', async () => {
      server.use(
        rest.get('*/api/v2/issues*', (req, res, ctx) => {
          return res(ctx.json(issueTestData.backlogServiceMilestoneResponse))
        })
      )

      issues = await backlogService.getActiveSprintData('namespace', 'apikey', 111, 111)

      expect(JSON.stringify(issues)).toBe(
        JSON.stringify(issueTestData.backlogServiceMilestoneResponse)
      )
    })
  })

  describe('if there are no issues', () => {
    it('should return expected body', async () => {
      server.use(
        rest.get('*/api/v2/issues*', (req, res, ctx) => {
          return res(ctx.json([]))
        })
      )

      issues = await backlogService.getActiveSprintData('namespace', 'apikey', 111, 111)

      expect(JSON.stringify(issues)).toBe(JSON.stringify([]))
    })
  })

  describe('if it has incorrect key', () => {
    const errors = {
      errors: [
        {
          message: 'Authentication failure.',
          code: 11,
          moreInfo: ''
        }
      ]
    }

    beforeAll(async () => {
      server.use(
        rest.get('*/api/v2/issues*', (req, res, ctx) => {
          return res(ctx.json(errors), ctx.status(401))
        })
      )

      try {
        await backlogService.getActiveSprintData('namespace', 'apikey', 111, 111)
      } catch (error: any) {
        issues = JSON.parse(error.message)
      }
    })

    it('should should throw an error with status of 401', () => {
      expect(issues.status).toBe(401)
    })

    it('should should throw an error with expected error message', () => {
      expect(JSON.stringify(issues.errors)).toBe(JSON.stringify(errors))
    })
  })

  describe('if it has incorrect namespace', () => {
    const errors = [{ message: 'Incorrect namespace' }]
    beforeAll(async () => {
      server.use(
        rest.get('*/api/v2/issues*', (req, res, ctx) => {
          return res(ctx.status(404))
        })
      )

      try {
        await backlogService.getActiveSprintData('namespace', 'apikey', 111, 111)
      } catch (error: any) {
        issues = JSON.parse(error.message)
      }
    })

    it('should should throw an error with status of 404', () => {
      expect(issues.status).toBe(404)
    })

    it('should should throw an error with no error message', () => {
      expect(issues).toHaveProperty('errors', errors)
    })
  })
})
