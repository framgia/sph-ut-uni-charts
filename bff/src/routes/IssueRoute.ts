import express from 'express'
import IssueController from '../controllers/IssueController'

const router = express.Router()
const issueController = new IssueController()

class IssueRoute {
  controller: IssueController

  constructor(controller: IssueController) {
    this.controller = controller
  }

  getIssues(endpoint: string) {
    return router.get(`${endpoint}`, this.controller.getIssues)
  }
}

const routes = new IssueRoute(issueController)
routes.getIssues('/:id')

export default router
