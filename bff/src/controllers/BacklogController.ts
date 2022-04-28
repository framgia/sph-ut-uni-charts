import BacklogService from '../services/BacklogService'
import { Request, Response } from 'express'

class BacklogController {
  public async getList(req: Request, res: Response) {
    try {
      const result = await BacklogService.backlogProjects(req.query)
      return res.send(result.data)
    } catch (error: any) {
      return res.status(error.response.status).send(error.response.data)
    }
  }
}

export default BacklogController
