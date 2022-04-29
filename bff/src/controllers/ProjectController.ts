import BacklogService from '../services/BacklogService'
import { Request, Response } from 'express'

const backlogService = new BacklogService()

export default class ProjectController {
  async getProjects(req: Request, res: Response) {
    const result = await backlogService.getProjects()
    res.send(result)
  }

  async getProjectById(req: Request, res: Response) {
    let response

    switch (req.body.service) {
      case 'backlog':
        const result = await backlogService.getProjectById(req.params.id)
        response = result
        break
      default:
        response = { message: 'Service information not provided.' }
    }

    res.send(response)
  }

  async deleteProjectById(req: Request, res: Response) {
    let response

    switch (req.body.service) {
      case 'backlog':
        const result = await backlogService.deleteProjectById(req.params.id)
        response = result
        break
      default:
        response = { message: 'Service information is not provided.' }
    }

    res.send(response)
  }
}
