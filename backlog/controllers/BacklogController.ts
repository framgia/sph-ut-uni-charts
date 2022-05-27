import BacklogService from '../services/BacklogService'
import Provider from '../models/Provider'
import { Response } from 'express'

const Service = new BacklogService()
const ProviderModel = new Provider()

export type InputRequest = {
  query: { user_id: number; providerId?: number; apiKey?: string }
}

class BacklogController {
  public async getList(req: InputRequest, res: Response) {
    let payload = req.query
    if (payload.providerId) {
      const provider = await ProviderModel.getProviderById({
        ...payload,
        id: payload.providerId
      })
      payload = { ...payload, apiKey: provider?.api_key }
    }

    try {
      const result = await Service.getProjects(payload)
      return res.send(result.data)
    } catch (error: any) {
      return res.status(error.response.status ?? 500).send(error?.response?.data ?? error)
    }
  }
}

export default BacklogController
