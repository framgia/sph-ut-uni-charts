import { Request, Response } from 'express'
import BacklogService from '../services/BacklogService'
import {
  IssuesInterface,
  ProjectInterface,
  ProviderInterface,
  MilestonesInterface
} from '../utils/interfaces'
import { errorWithCustomMessage } from '../utils/helpers'
import Controller from './Controller'

const backlogService = new BacklogService()

class IssueController extends Controller {
  async getIssues(req: Request, res: Response) {
    try {
      let response
      const user = await super.user({ email: req.header('authorization') as string })

      switch (req.query.service) {
        case 'backlog':
          // get the project
          const project: ProjectInterface = (await backlogService.getProjectById(req.params.id, {
            user_id: user.id
          })) as any

          // get the provider
          const provider: ProviderInterface = await backlogService.getProviderById(
            project.provider_id
          )

          // get the milestones
          const milestones: MilestonesInterface[] = (await backlogService.getMilestones(
            provider.space_key,
            provider.api_key,
            project.project_id
          )) as any

          let issuesList: { milestone: string; issues: IssuesInterface[] }[] = []

          // get issues for each milestone
          for (const milestone of milestones) {
            const issues: IssuesInterface[] = (await backlogService.getIssues(
              provider.space_key,
              provider.api_key,
              milestone.id
            )) as any

            const issuesData = issues.map((issue) => {
              return {
                id: issue.id,
                actualHours: issue.actualHours || 0,
                estimatedHours: issue.estimatedHours || 0,
                currentStatus: issue.status?.name || 'Open'
              }
            })

            // add the issues of each milestone to the list
            issuesList.push({ milestone: milestone.name, issues: issuesData })
          }

          // update response with the issues list
          response = issuesList

          break
        default:
          errorWithCustomMessage(400, { message: 'Service information not provided.' })
      }

      res.send(response)
    } catch (error: any) {
      const response = JSON.parse(error.message)
      res.status(response.status).json(response.errors)
    }
  }
}

export default IssueController
