import { rest } from 'msw'
import BacklogService from '../../../services/BacklogService'
import { server } from '../../../../jest.setup'

import issueTestData from '../../constants/issueTestData.json'

const backlogService = new BacklogService()

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

    it('should throw an error with status of 401', () => {
      expect(milestones.status).toBe(401)
    })

    it('should throw an error with expected error message', () => {
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

    it('should throw an error with status of 404', () => {
      expect(milestones.status).toBe(404)
    })

    it('should throw an error with expected error message', () => {
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

    it('should throw an error with status of 404', () => {
      expect(milestones.status).toBe(404)
    })

    it('should throw an error with no error message', () => {
      expect(milestones).toHaveProperty('errors', '')
    })
  })
})
