import prisma from '../utils/client'
import { Request, Response } from 'express'

export default class ProjectController {
  async getProjects(req: Request, res: Response) {
    const filterProvider: any = req.query?.filterProvider
    const searchProvider: any = req.query?.searchProvider

    let result = await prisma.project.findMany({
      where: {
        ...(filterProvider
          ? {
              provider: {
                OR: {
                  name: {
                    equals: String(filterProvider),
                    mode: 'insensitive'
                  }
                }
              }
            }
          : {})
      }
    })

    if (searchProvider) {
      result = result.filter(
        (data) =>
          data.name.toLocaleLowerCase().indexOf(String(searchProvider.toLocaleLowerCase())) > -1
      )
    }

    res.status(200).json(result)
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

  async deleteProjectById(req: Request, res: Response) {
    if (/[a-zA-z]/.test(req.params.id)) {
      res.send({
        message: 'Invalid ID'
      })
    } else {
      const project = await prisma.project.findUnique({
        where: {
          id: Number(req.params.id)
        }
      })

      const result: any = !project
        ? { message: 'ID does not exist' }
        : await prisma.project.delete({
            where: {
              id: Number(req.params.id)
            }
          })

      res.send(result)
    }
  }
}
