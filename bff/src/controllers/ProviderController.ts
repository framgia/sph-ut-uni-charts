import BacklogService from '../services/BacklogService'
import { Request, Response } from 'express'
import Controller from './Controller'

class ProviderController extends Controller {
  async add(req: Request, res: Response) {
    const user = await super.user({ email: req.header('authorization') as string })
    req.body.user_id = user.id
    let result

    switch (req.body.name) {
      case 'Backlog':
        result = await BacklogService.add(req.body)
        break
      default:
        return res.status(400).send({ message: 'Invalid Provider' })
    }

    res.status(result.status).send(result.data)
  }

  async getProviders(req: Request, res: Response) {
    const user = await super.user({ email: req.header('authorization') as string })

    try {
      const backlog = await BacklogService.getProviders({ user_id: user.id })
      res.send(backlog.data)
    } catch (error: any) {
      res.status(error?.response?.status ?? 500).send(error)
    }
  }

  async filterListByProvider(req: Request, res: Response) {
    const user = await super.user({ email: req.header('authorization') as string })
    req.query.user_id = user.id

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
