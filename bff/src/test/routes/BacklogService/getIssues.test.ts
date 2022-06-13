import { rest } from 'msw'
import BacklogService from '../../../services/BacklogService'
import { server } from '../../../../jest.setup'

import issueTestData from '../../constants/issueTestData.json'

const backlogService = new BacklogService()

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

    it('should throw an error with status of 401', () => {
      expect(issues.status).toBe(401)
      expect(JSON.stringify(issues.errors)).toBe(JSON.stringify(errors))
    })

    it('should throw an error with expected error message', () => {
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

    it('should throw an error with status of 404', () => {
      expect(issues.status).toBe(404)
    })

    it('should throw an error with `Incorrect namespace` as the error message', () => {
      expect(issues).toHaveProperty('errors', [{ message: 'Incorrect namespace' }])
    })
  })
})
