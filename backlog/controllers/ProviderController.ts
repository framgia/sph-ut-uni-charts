const Provider = require('../models/Provider')
const Validation = require('../validations/ProviderValidation')
const Controller = require('./Controller')
import { Context } from '../utils/context'
import { PrismaClient } from '@prisma/client'

let ctx: Context = { prisma: new PrismaClient() }

class ProviderController extends Controller {
  public async add(req: any, res: any) {
    const ProviderModel = new Provider()
    const errors = Validation.add(req.body)

    if (errors) return res.status(422).send(errors)

    const hasProjectRegistered = await ProviderModel.isProjectRegistered(req.body, ctx)

    if (hasProjectRegistered.length)
      return res
        .status(400)
        .send([{ message: `You already registered this project: ${req.body.project_name}` }])

    const provider = await ProviderModel.add(req.body, ctx)

    return res.send(provider)
  }
}

export default ProviderController
