// @ts-nocheck
import httpMocks from 'node-mocks-http'
import ProjectController from '../../controllers/ProjectController'
import { Request, Response } from 'express'
import { prismaMock } from '../../utils/singleton'
import { IProjectData } from 'interfaces/Project'
import { testData, mockedProjectResponse } from '../const/project'
import { IProject } from '../../models/interfaces/Project'
import { Request } from 'express'
import { TypedResponse } from '../interfaces/response'

let req: Request
let res: TypedResponse
let Controller: any
const totalTestData = 40

beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  Controller = new ProjectController()
})

describe('When calling getProjects function', () => {
  describe('when fetching projects is successful', () => {
    beforeEach(async () => {
      prismaMock.project.findMany.mockResolvedValue(
        [...Array(totalTestData)].map(() => testData[0])
      )

      const { getProjects } = new ProjectController()
      req.body = { providerFitler: 'Backlog' }
      await getProjects(req, res)
    })

    it('should return status 200', () => {
      expect(res.statusCode).toBe(200)
    })

    it('should return the expected array length of three datas', () => {
      expect(res._getJSONData().total).toBe(totalTestData)
    })

    it('should have a correct body structure properties', () => {
      expect(Array.isArray(res._getJSONData().data)).toBeTruthy()
      res._getJSONData().data.forEach((data: IProject) => {
        expect(data).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          key: expect.any(String),
          project_id: expect.any(Number),
          provider_id: expect.any(Number)
        })
      })
    })
  })

  describe('when using pagination', () => {
    beforeEach(async () => {
      prismaMock.project.findMany.mockResolvedValue(
        [...Array(totalTestData)].map(() => testData[0])
      )
    })

    describe('when fetching body object', () => {
      beforeEach(async () => {
        const { getProjects } = new ProjectController()
        await getProjects(req, res)
      })

      it('should have a correct body structure properties', async () => {
        expect(res._getJSONData()).toMatchObject({
          page: expect.any(Number),
          per_page: expect.any(Number),
          prev_page: expect.toBeNullOr(Number),
          next_page: expect.toBeNullOr(Number),
          total: expect.any(Number),
          total_pages: expect.any(Number),
          data: expect.any(Array)
        })
      })

      it('should return the correct pagination properties value', async () => {
        expect(res._getJSONData()).toMatchObject({
          page: 1,
          per_page: 10,
          prev_page: null,
          next_page: 2,
          total: totalTestData,
          total_pages: totalTestData / 10
        })
      })
    })

    it('should return the same page value specified in the query-page', async () => {
      const selectedPage = 2
      const { getProjects } = new ProjectController()
      await getProjects({ ...req, query: { page: selectedPage } }, res)

      expect(res._getJSONData().page).toBe(selectedPage)
      expect(res._getJSONData().prev_page).toBe(1)
      expect(res._getJSONData().next_page).toBe(3)
    })
  })
})

describe('When calling "getProjectById" function', () => {
  describe('when ID is invalid', () => {
    beforeEach(async () => {
      req.params = { id: 'test' }
      await Controller.getProjectById(req, res)
    })

    it('should return status of 400', () => {
      expect(res.statusCode).toBe(400)
    })

    it('should respond "Invalid ID" as validation error', () => {
      const data = res._getJSONData()
      expect(data).toHaveProperty('message', 'Invalid ID')
    })
  })

  describe('when project with provided ID does not exist', () => {
    beforeEach(async () => {
      req.params = { id: 99999999999999 }
      await Controller.getProjectById(req, res)
    })

    it('should return status of 404', () => {
      expect(res.statusCode).toBe(404)
    })

    it('should respond "No Data Found" as validation error', () => {
      const data = res._getJSONData()
      expect(data).toHaveProperty('message', 'No Data Found')
    })
  })
})

describe('When calling deleteProjectById function', () => {
  let req: Request
  let res: TypedResponse

  beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
  })

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
      prismaMock.project.findFirst.mockResolvedValueOnce(testData[0])
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
