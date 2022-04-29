import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import express from 'express'
import ProjectRouter from '../../routes/ProjectRoute'

const prisma = new PrismaClient()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', ProjectRouter)

describe('Project Router Test Suite', () => {
  let project: any

  beforeEach(async () => {
    const provider = await prisma.provider.create({
      data: {
        user_id: 1,
        name: 'provider-1',
        space_key: 'space-key-1',
        api_key: 'api-key-1'
      }
    })

    project = await prisma.project.create({
      data: {
        name: 'provider-1',
        key: 'key-1',
        project_id: 1,
        provider_id: provider.id
      }
    })
  })

  afterEach(async () => {
    const projects = prisma.project.deleteMany()
    const providers = prisma.provider.deleteMany()
    await prisma.$transaction([projects, providers])
    await prisma.$disconnect()
  })

  test('Test #1: /projects/:id - if ID exist', async () => {
    const data = await request(app).get(`/${project.id}`)

    expect(JSON.parse(data.text)).toMatchObject({
      id: project.id,
      name: 'provider-1',
      key: 'key-1',
      project_id: 1,
      provider_id: project.provider_id
    })
  })

  test('Test #2: /projects/:id - if ID does not exist', async () => {
    const projects = prisma.project.deleteMany()
    const providers = prisma.provider.deleteMany()
    await prisma.$transaction([projects, providers])
    const data = await request(app).get('/1111111')
    expect(JSON.parse(data.text)).toHaveProperty('message', 'No Data Found')
  })

  test('Test #3: /projects/:id - invalid ID, letters are not valid, it should be a number', async () => {
    const data = await request(app).get('/tests')
    expect(JSON.parse(data.text)).toHaveProperty('message', 'Invalid ID')
  })

  test('Test #4: /projects - with array of objects', async () => {
    const data = await prisma.project.findMany()
    const filteredData = data.filter((obj: any) => obj.id === project.id)

    expect(filteredData[0]).toMatchObject({
      id: project.id,
      name: 'provider-1',
      key: 'key-1',
      project_id: 1,
      provider_id: project.provider_id
    })
  })

  test('Test #5: /projects - with empty array', async () => {
    const projects = prisma.project.deleteMany()
    const providers = prisma.provider.deleteMany()
    await prisma.$transaction([projects, providers])
    const data = await prisma.project.findMany()
    expect(data).toStrictEqual([])
  })

  test('Test #6: /projects/delete/:id - Invalid ID, it should be a number', async () => {
    const data = await request(app).get('/1111111')
    expect(JSON.parse(data.text)).toHaveProperty('message', 'No Data Found')
  })
})
