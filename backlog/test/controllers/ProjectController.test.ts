// import { PrismaClient } from '@prisma/client'
// import httpMocks from 'node-mocks-http'
// import ProjectController from '../../controllers/ProjectController'

// const prisma = new PrismaClient()
// const projectController = new ProjectController()

import ProjectController from '../../controllers/ProjectController'
import httpMocks from 'node-mocks-http'
import { prismaMock } from '../../utils/singleton'
import { IProjectData } from 'models/interfaces/Project'
import { testData } from '../const/project'

let req: any, res: any
beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
})

describe('When calling getProjects function', () => {
  let payload: IProjectData[]

  beforeEach(async () => {
    payload = testData.map(({ created_at, updated_at, ...rest }) => rest)
  })

  describe('when fetching projects is successful', () => {
    beforeEach(async () => {
      prismaMock.project.findMany.mockResolvedValue(testData)

      const { getProjects } = new ProjectController()
      await getProjects(req, res)
    })

    it('should return status 200', () => {
      expect(res.statusCode).toBe(200)
    })

    it('should return the expected body object', () => {
      expect(res._getJSONData()).toMatchObject(payload)
    })

    it('should return the expected array length of three datas', () => {
      const data = res._getJSONData()
      expect(data.length).toBe(3)
    })
  })

  describe('when fetching projects with provider filter argument', () => {
    beforeEach(async () => {
      prismaMock.project.findMany.mockResolvedValue([testData[0]])

      const { getProjects } = new ProjectController()
      req.body = { providerFitler: 'Backlog' }
      await getProjects(req, res)
    })

    it('should have an argument "providerFitler"', () => {
      expect(req.body.providerFitler).not.toBe(undefined)
    })

    it('should return the expected body object', () => {
      expect(res._getJSONData()).toMatchObject([payload[0]])
    })

    it('should return the expected array length of one datas out of three', () => {
      const data = res._getJSONData()
      expect(data.length).toBe(1)
    })
  })

  describe('when fetching projects with search argument', () => {
    beforeEach(async () => {
      prismaMock.project.findMany.mockResolvedValue(testData.filter((d, i) => i !== 1))

      const { getProjects } = new ProjectController()
      req.body = { searchProvider: 'lo' }
      await getProjects(req, res)
    })

    it('should have an argument "searchProvider"', () => {
      expect(req.body.searchProvider).not.toBeNull()
    })

    it('should return the expected body object', () => {
      expect(res._getJSONData()).toMatchObject(payload.filter((d, i) => i !== 1))
    })

    it('should return the expected array length of two datas out of three', () => {
      const data = res._getJSONData()
      expect(data.length).toBe(2)
    })
  })
})

describe('When calling deleteProjectById function', () => {
  describe('if ID does not exist', () => {
    beforeEach(async () => {
      prismaMock.project.findUnique.mockResolvedValueOnce(null)

      req.params = { id: 1 }

      const controller = new ProjectController()
      await controller.deleteProjectById(req, res)
    })

    it('should return status of 404', () => {
      expect(res.statusCode).toBe(404)
    })

    it('should return expected response', () => {
      const data = res._getJSONData()
      expect(JSON.stringify(data)).toBe(JSON.stringify({ message: 'ID does not exist' }))
    })
  })

  describe('if ID is not a number', () => {
    beforeEach(async () => {
      req.params = { id: 'test' }

      const controller = new ProjectController()
      await controller.deleteProjectById(req, res)
    })

    it('should return status of 400', () => {
      expect(res.statusCode).toBe(400)
    })

    it('should return expected response', () => {
      const data = res._getJSONData()
      expect(JSON.stringify(data)).toBe(JSON.stringify({ message: 'Invalid ID' }))
    })
  })

  describe('if delete is successful', () => {
    beforeEach(async () => {
      prismaMock.project.findUnique.mockResolvedValueOnce(testData[0])
      prismaMock.project.delete.mockResolvedValueOnce(testData[0])
      req.params = { id: 1 }

      const controller = new ProjectController()
      await controller.deleteProjectById(req, res)
    })

    it('should return status of 200', () => {
      expect(res.statusCode).toBe(200)
    })

    it('should return expected response', () => {
      const data = res._getData()
      expect(JSON.stringify(data)).toBe(JSON.stringify(testData[0]))
    })
  })
})

// describe('Project Controller Test Suite', () => {
//   // let project: any

//   beforeEach(async () => {
//     //   const provider = await prisma.provider.create({
//     //     data: {
//     //       user_id: 1,
//     //       name: 'provider-1',
//     //       space_key: 'space-key-1',
//     //       api_key: 'api-key-1'
//     //     }
//     //   })
//     //   project = await prisma.project.create({
//     //     data: {
//     //       name: 'provider-1',
//     //       key: 'key-1',
//     //       project_id: 1,
//     //       provider_id: provider.id
//     //     }
//     //   })
//   })

//   // afterEach(async () => {
//   //   const projects = prisma.project.deleteMany()
//   //   const providers = prisma.provider.deleteMany()
//   //   await prisma.$transaction([projects, providers])
//   //   await prisma.$disconnect()
//   // })

//   // test('Test #1: getProjectById - if ID exist or not in the database', async () => {
//   //   const request = httpMocks.createRequest({
//   //     method: 'GET',
//   //     url: '/projects/:id',
//   //     params: {
//   //       id: `${project.id}`
//   //     }
//   //   })

//   //   const response = httpMocks.createResponse()
//   //   await projectController.getProjectById(request, response)
//   //   const data = response._getData()

//   //   expect(data).toMatchObject({
//   //     id: project.id,
//   //     name: 'provider-1',
//   //     key: 'key-1',
//   //     project_id: 1,
//   //     provider_id: project.provider_id
//   //   })
//   // })

//   // test('Test #2: getProjectById - if ID does not exist orin the database', async () => {
//   //   const projects = prisma.project.deleteMany()
//   //   const providers = prisma.provider.deleteMany()
//   //   await prisma.$transaction([projects, providers])

//   //   const request = httpMocks.createRequest({
//   //     method: 'GET',
//   //     url: '/projects/:id',
//   //     params: {
//   //       id: '111111'
//   //     }
//   //   })

//   //   const response = httpMocks.createResponse()
//   //   await projectController.getProjectById(request, response)
//   //   const data = response._getData()
//   //   expect(data).toHaveProperty('message', 'No Data Found')
//   // })

//   // test('Test #3: getProjectById - invalid ID, letters are not valid, it should be a number', async () => {
//   //   const request = httpMocks.createRequest({
//   //     method: 'GET',
//   //     url: '/projects/:id',
//   //     params: {
//   //       id: 'tests'
//   //     }
//   //   })

//   //   const response = httpMocks.createResponse()
//   //   await projectController.getProjectById(request, response)
//   //   const data = response._getData()
//   //   expect(data).toHaveProperty('message', 'Invalid ID')
//   // })

//   // test('Test #4: /projects - with array of objects', async () => {
//   //   const request = httpMocks.createRequest({
//   //     method: 'GET',
//   //     url: '/projects'
//   //   })

//   //   const response = httpMocks.createResponse()
//   //   await projectController.getProjects(request, response)
//   //   const data = response._getData()
//   //   const filteredData = data.filter((obj: any) => obj.id === project.id)

//   //   expect(filteredData[0]).toMatchObject({
//   //     id: project.id,
//   //     name: 'provider-1',
//   //     key: 'key-1',
//   //     project_id: 1,
//   //     provider_id: project.provider_id
//   //   })
//   // })

//   // test('Test #5: /projects - with empty array', async () => {
//   //   const projects = prisma.project.deleteMany()
//   //   const providers = prisma.provider.deleteMany()
//   //   await prisma.$transaction([projects, providers])

//   //   const request = httpMocks.createRequest({
//   //     method: 'GET',
//   //     url: '/projects'
//   //   })

//   //   const response = httpMocks.createResponse()
//   //   await projectController.getProjects(request, response)
//   //   const data = response._getData()
//   //   expect(data).toStrictEqual([])
//   // })

// })
