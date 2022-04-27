import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export default class ProjectController {
  async getProjects(req: Request, res: Response) {
    const result = await prisma.project.findMany()
    res.send(result)
  }

  async getProjectById(req: Request, res: Response) {
    if (/[a-zA-z]/.test(req.params.id)) {
      res.send({
        message: 'Invalid ID'
      })
    } else {
      const result = await prisma.project.findUnique({
        where: {
          id: Number(req.params.id)
        }
      })

      res.send(!result ? { message: 'No Data Found' } : result)
    }
  }
}
