import Provider from '../models/Provider'
import Validation from '../validations/ProviderValidation'
import BacklogService from '../services/BacklogService'
import { Request, Response } from 'express'
import { InputRequest } from '../interfaces/Provider'

const Service = new BacklogService()
const ProviderModel = new Provider()
class ProviderController {
  public async add(req: Request, res: Response) {
    let payload = req.body

    const errors = Validation.add(payload)
    if (errors) return res.status(422).send(errors)

    if (payload.id) {
      const provider = await ProviderModel.getProviderById(payload)
      payload = { ...payload, ...provider }
    }

    if (!payload.space_key) {
      const space = await Service.getSpace({ apiKey: payload.api_key })
      payload = { ...payload, space_key: space.data.spaceKey }
    }

    const project = await Service.getProject({
      api_key: payload.api_key,
      projectIdOrKey: payload.project_id
    })
    payload = { ...payload, project_key: project.data.projectKey, project_name: project.data.name }

    const hasProjectRegistered = await ProviderModel.isProjectRegistered(payload)

    if (hasProjectRegistered.length)
      return res
        .status(400)
        .send([{ message: `You already registered this project: ${payload.project_name}` }])

    const provider = await ProviderModel.add(payload)

    return res.send(provider)
  }

  public async getProviders(req: Request, res: Response) {
    const errors = Validation.getList(req.query)
    if (errors) return res.status(422).send(errors)

    const providers = await ProviderModel.getProviders(Number(req.query.user_id))
    return res.send(providers)
  }

  async getProviderById(req: InputRequest, res: Response) {
    if (/[^0-9]/.test(req.params.id)) {
      res.status(400).json({ message: 'Invalid ID' })
    } else {
      const payload = {
        id: Number(req.params.id),
        user_id: req.query.user_id
      }
      const provider = await ProviderModel.getProviderById(payload)

      if (!provider) {
        res.status(404).json({ message: 'No Provider Found' })
      } else {
        res.send(provider)
      }
    }
  }
}

export default ProviderController
