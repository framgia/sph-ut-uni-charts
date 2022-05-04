import BacklogService from '../services/BacklogService'
import { Request, Response } from 'express'

class ProviderController {
  static async add(req: Request, res: Response) {
    let result
    const payload = { ...req.body, user_id: 1 }

    switch (req.body.name) {
      case 'Backlog':
        result = await BacklogService.add(payload)
        break
      default:
        return res.status(400).send({ message: 'Invalid Provider' })
    }

    res.status(result.status).send(result.data)
  }

  static async getProviders(req: Request, res: Response) {
    try {
      const backlog = await BacklogService.getProviders(req.query)
      res.send([{ backlog: backlog.data }])
    } catch (error: any) {
      res.status(error?.response?.status ?? 500).send(error)
    }
  }

  static async filterListByProvider(req: Request, res: Response) {
    const backlogService = new BacklogService()
    let result

    switch (req.query.service) {
      case 'backlog':
        result = await backlogService.getProviderById(req.params.id)
        break
      default:
        result = { message: 'Invalid Provider' }
    }

    if (result.projects) {
      res.send(result.projects)
    } else {
      res.send(result)
    }
  }
}

export default ProviderController
