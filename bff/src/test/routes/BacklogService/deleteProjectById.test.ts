import { rest } from 'msw'
import BacklogService from '../../../services/BacklogService'
import { server } from '../../../../jest.setup'

import projectTestData from '../../constants/projectTestData.json'

const backlogService = new BacklogService()

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

    it('should throw an error withstatus of 404', () => {
      expect(project.status).toBe(404)
    })

    it('should throw an error with "ID does not exist" as error message', () => {
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

    it('should throw an error with status of 400', () => {
      expect(project.status).toBe(400)
    })

    it('should throw an error with "Invalid ID" as error message', () => {
      expect(project).toHaveProperty('errors')
      expect(JSON.stringify(project.errors)).toBe(JSON.stringify({ message: 'Invalid ID' }))
    })
  })
})
