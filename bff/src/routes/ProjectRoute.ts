import express from 'express'
import ProjectController from '../controllers/ProjectController'

const router = express.Router()
const projectController = new ProjectController()

class ProjectRoute {
  controller: ProjectController

  constructor(controller: ProjectController) {
    this.controller = controller
  }

  getProjects(endpoint: string) {
    return router.get(`${endpoint}`, this.controller.getProjects)
  }

  getProjectById(endpoint: string) {
    return router.get(`${endpoint}`, this.controller.getProjectById)
  }

  deleteProjectById(endpoint: string) {
    return router.delete(`${endpoint}`, this.controller.deleteProjectById)
  }
  getActiveSprintData(endpoint: string) {
    return router.get(`${endpoint}`, this.controller.getActiveSprintData)
  }
}

const routes = new ProjectRoute(projectController)
routes.getProjects('/')
routes.getProjectById('/:id')
routes.deleteProjectById('/:id')
routes.getActiveSprintData('/:id/active-sprint-data')
export default router
