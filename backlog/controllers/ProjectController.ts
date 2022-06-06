import { Response } from 'express'

import { InputRequest, GetProjectsInput } from '../interfaces/Project'
import Project from '../models/Project'
import Paginator from '../utils/Paginator'
import prisma from '../utils/client'

export default class ProjectController {
  async getProjects(req: { query: GetProjectsInput }, res: Response) {
    const result = await Project.projectsWithParams(req.query)
    const { page = 1 } = req.query

    res.status(200).json(Paginator(result, page, 10))
  }

  async getProjectById(req: InputRequest, res: Response) {
    if (/[a-zA-z]/.test(req.params.id)) {
      res.status(400).json({
        message: 'Invalid ID'
      })
    } else {
      const result = await prisma.project.findFirst({
        where: {
          user_id: { equals: req.query.user_id },
          id: Number(req.params.id)
        }
      })

      if (!result) res.status(404).json({ message: 'No Data Found' })
      else res.send(result)
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
