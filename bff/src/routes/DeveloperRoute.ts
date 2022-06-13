import express from 'express'
import DeveloperController from '../controllers/DeveloperController'

const router = express.Router()
const developerController = new DeveloperController()

class DeveloperRoute {
  controller: DeveloperController

  constructor(controller: DeveloperController) {
    this.controller = controller
  }

  getDeveloperInfo(endpoint: string) {
    return router.get(`${endpoint}`, this.controller.getDeveloperInfo)
  }

  getDeveloperIcon(endpoint: string) {
    return router.get(`${endpoint}`, this.controller.getDeveloperIcon)
  }
}

const routes = new DeveloperRoute(developerController)
routes.getDeveloperInfo('/:developer_id')
routes.getDeveloperIcon('/:developer_id/icon')

export default router
