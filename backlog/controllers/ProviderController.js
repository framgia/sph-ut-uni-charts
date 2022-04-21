const Provider = require('../models/Provider')
const Validation = require('../validations/ProviderValidation')
class ProviderController {
  static async add(req, res) {
    const errors = Validation.add(req.body)

    if (errors) return res.status(422).send(errors)

    const hasProjectRegistered = await Provider.isProjectRegistered(req.body)

    if (hasProjectRegistered.length)
      return res
        .status(400)
        .send([{ message: `You already registered this project: ${req.body.project_name}` }])

    const provider = await Provider.add(req.body)

    return res.send(provider)
  }
}

module.exports = ProviderController
