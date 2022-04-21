const BacklogService = require('../services/backlog')
class ProviderController {
  static async add(req, res) {
    let result

    switch (req.body.provider) {
      case 'backlog':
        result = await BacklogService.add(req.body)
        break
      default:
        return res.status(400).send({ message: 'Invalid Provider' })
    }

    res.status(result.status).send(result.data)
  }
}

module.exports = ProviderController
