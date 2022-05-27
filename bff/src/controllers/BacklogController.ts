import BacklogService from '../services/BacklogService'
import { Request, Response } from 'express'
import Controller from './Controller'

class BacklogController extends Controller {
  public async getList(req: Request, res: Response) {
    const user = await super.user({ email: req.header('authorization') as string })
    req.query.user_id = user.id

    try {
      const result = await BacklogService.backlogProjects(req.query)
      return res.send(result.data)
    } catch (error: any) {
      return res.status(error.response.status).send(error?.response?.data ?? error)
    }
  }
}

export default BacklogController
