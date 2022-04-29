import request from 'supertest'
import express from 'express'
import ProjectRoute from '../../routes/ProjectRoute'

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

  test('Test #5: deleteProjectById - if ID does not exist in the database', async () => {
    const result = await request(app).delete('/111111').send({ service: 'backlog' })
    const data = JSON.parse(result.text)
    expect(data).toHaveProperty('message', 'ID does not exist')
  })

  test('Test #6: deleteProjectById - invalid ID, letters are not valid, should be number', async () => {
    const result = await request(app).delete('/test').send({ service: 'backlog' })
    const data = JSON.parse(result.text)
    expect(data).toHaveProperty('message', 'Invalid ID')
  })

})
