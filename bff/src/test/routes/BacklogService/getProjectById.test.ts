import { rest } from 'msw'
import BacklogService from '../../../services/BacklogService'
import { server } from '../../../../jest.setup'

import projectTestData from '../../constants/projectTestData.json'

const backlogService = new BacklogService()

describe('When using getProjectById() function', () => {
  let project: any

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
