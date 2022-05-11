import { PrismaClient } from '@prisma/client'
import request from 'supertest'
import express from 'express'
import ProviderRoute from '../../routes/ProviderRoute'

const prisma = new PrismaClient()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', ProviderRoute)

describe('/providers/:id', () => {
  let provider: any

  beforeEach(async () => {
    provider = await prisma.provider.create({
      data: {
        user_id: 1,
        name: 'provider-1',
        space_key: 'space-key-1',
        api_key: 'api-key-1'
      }
    })
  })

  afterEach(async () => {
    const projects = prisma.project.deleteMany()
    const providers = prisma.provider.deleteMany()
    await prisma.$transaction([projects, providers])
    await prisma.$disconnect()
  })

  it('should return 200 and provider details when ID exists', async () => {
    const response = await request(app).get(`/${provider.id}`)
    const parsedResponse = JSON.parse(response.text)

    expect(response.statusCode).toBe(200)
    expect(parsedResponse).toMatchObject({
      id: 81,
      ...provider,
      created_at: parsedResponse.created_at,
      updated_at: parsedResponse.updated_at
    })
  })

  it('should return 404 and error details when ID do not exist', async () => {
    const providers = prisma.provider.deleteMany()
    await prisma.$transaction([providers])
    const response = await request(app).get('/1111111')

    expect(response.statusCode).toBe(404)
    expect(JSON.parse(response.text)).toHaveProperty('message', 'No Provider Found')
  })

  it('should return 400 and error details when ID is not number', async () => {
    const response = await request(app).get('/tests')

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response.text)).toHaveProperty('message', 'Invalid ID')
  })
})
