import prisma from '../utils/client'
import { Response } from 'express'
import { InputRequest, GetProjectsInput } from '../interfaces/Project'
export default class ProjectController {
  async getProjects(req: { query: GetProjectsInput }, res: Response) {
    const { filterProvider, searchProvider, user_id } = req.query

    let result = await prisma.project.findMany({
      where: {
        user_id,
        ...(filterProvider
          ? {
              provider: {
                OR: {
                  name: {
                    equals: filterProvider,
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
        (data) => data.name.toLocaleLowerCase().indexOf(searchProvider.toLocaleLowerCase()) > -1
      )
    }

    res.status(200).json(result)
  }

  async getProjectById(req: InputRequest, res: Response) {
    if (/[a-zA-z]/.test(req.params.id)) {
      res.send({
        message: 'Invalid ID'
      })
    } else {
      const result = await prisma.project.findFirst({
        where: {
          user_id: { equals: req.query.user_id },
          id: Number(req.params.id)
        }
      })

      res.send(!result ? { message: 'No Data Found' } : result)
    }
  }

  async deleteProjectById(req: InputRequest, res: Response) {
    if (/[a-zA-z]/.test(req.params.id)) {
      res.status(400).json({ message: 'Invalid ID' })
    } else {
      const project = await prisma.project.findFirst({
        where: {
          user_id: req.query.user_id,
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
