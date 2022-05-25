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
      },
      include: { provider: true }
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
      res.status(400).json({
        message: 'Invalid ID'
      })
    } else {
      const result = await prisma.project.findUnique({
        where: {
          id: Number(req.params.id)
        }
      })

      if (!result) res.status(404).json({ message: 'No Data Found' })
      else res.send(result)
    }
  }

  async deleteProjectById(req: Request, res: Response) {
    if (/[a-zA-z]/.test(req.params.id)) {
      res.status(400).json({ message: 'Invalid ID' })
    } else {
      const project = await prisma.project.findUnique({
        where: {
          id: Number(req.params.id)
        }
      })

      if (!project) {
        res.status(404).json({ message: 'ID does not exist' })
      } else {
        const result = await prisma.project.delete({
          where: {
            id: Number(req.params.id)
          }
        })

        res.send(result)
      }
    }
  }
}
