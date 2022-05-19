import { rest } from 'msw'
import request from 'supertest'
import express from 'express'
import ProjectRoute from '../../routes/ProjectRoute'
import { server } from '../../../jest.setup'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', ProjectRoute)

describe('Project Route Test Suite', () => {
  test('Test #1: getProjectById - if ID exist in the database', async () => {
    const projects: any = await request(app).get('/')
    const data = JSON.parse(projects.text)

    if (!data.length) {
      expect(data).toStrictEqual([])
    } else {
      const result = await request(app).get(`/${data[0].id}`).send({ service: 'backlog' })
      expect(JSON.parse(result.text)).toHaveProperty('id')
    }
  })

  test('Test #2: getProjectById - if ID does not exist in the database', async () => {
    const result = await request(app).get('/111111').send({ service: 'backlog' })
    const data = JSON.parse(result.text)
    expect(data).toHaveProperty('message', 'No Data Found')
  })

  test('Test #3: getProjectById - invalid ID, letters are not valid', async () => {
    const result = await request(app).get('/test').send({ service: 'backlog' })
    const data = JSON.parse(result.text)
    expect(data).toHaveProperty('message', 'Invalid ID')
  })

  test('Test #4: getProjects - either array of objects or empty array', async () => {
    const projects = await request(app).get('/')
    const data = JSON.parse(projects.text)
    if (!data.length) expect(data).toStrictEqual([])
    else expect(data[0]).toHaveProperty('id')
  })
})

describe('When deleting through /projects/:id route', () => {
  let result: request.Response

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
