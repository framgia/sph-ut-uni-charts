import { rest } from 'msw'
import request from 'supertest'
import express from 'express'
import ProjectRoute from '../../routes/ProjectRoute'
import { server } from '../../../jest.setup'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', ProjectRoute)

describe('When deleting through /projects/:id route', () => {
  let result: request.Response

  beforeEach(async () => {
    server.use(
      rest.get('*/users/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ id: 1 }))
      })
    )
  })

  describe('if ID does not exist in the database', () => {
    beforeEach(async () => {
      server.use(
        rest.delete('*/api/projects/:id', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ message: 'ID does not exist' }))
        })
      )

      result = await request(app).delete('/111111').query({ service: 'backlog' })
    })

    it('should return status of 200', () => {
      expect(result.status).toBe(200)
    })

    it('should return expected error message', () => {
      const data = JSON.parse(result.text)
      expect(data).toHaveProperty('message', 'ID does not exist')
    })
  })

  describe('if invalid ID, letters are not valid, should be number', () => {
    beforeEach(async () => {
      server.use(
        rest.delete('*/api/projects/:id', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json({ message: 'Invalid ID' }))
        })
      )

      result = await request(app).delete('/test').query({ service: 'backlog' })
    })

    it('should return status of 200', () => {
      expect(result.status).toBe(200)
    })

    it('should return expepcted error message', () => {
      const data = JSON.parse(result.text)
      expect(data).toHaveProperty('message', 'Invalid ID')
    })
  })

  describe('if valid ID', () => {
    const sampleProject = {
      id: 0,
      name: 'name',
      key: 'key',
      project_id: 0,
      provider_id: 0,
      created_at: '2022-05-16T03:27:14.335Z',
      updated_at: '2022-05-16T03:26:28.033Z'
    }

    beforeEach(async () => {
      server.use(
        rest.delete('*/api/projects/:id', (req, res, ctx) => {
          return res(ctx.status(200), ctx.json(sampleProject))
        })
      )

      result = await request(app).delete('/4').query({ service: 'backlog' })
    })

    it('should return status of 200', () => {
      expect(result.status).toBe(200)
    })

    it('should return deleted project data', () => {
      expect(result.text).toBe(JSON.stringify(sampleProject))
    })
  })
})
