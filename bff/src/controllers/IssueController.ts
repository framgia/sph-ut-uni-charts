import { Request, Response } from 'express'
import BacklogService from '../services/BacklogService'
import {
  IssuesInterface,
  ProjectInterface,
  ProviderInterface,
  MilestonesInterface
} from '../utils/interfaces'

const backlogService = new BacklogService()

class IssueController {
  async getIssues(req: Request, res: Response) {
    let response
    let project: ProjectInterface = {} as ProjectInterface
    let provider: ProviderInterface = {} as ProviderInterface

    switch (req.query.service) {
      case 'backlog':
        const result: unknown = await backlogService.getProjectById(req.params.id)
        response = result
        project = result as ProjectInterface
        break
      default:
        response = { message: 'Service information not provided.' }
    }

    if (Object.keys(project).length) {
      // get the provider of the project
      provider = await backlogService.getProviderById(project.provider_id)
      response = provider

      if (Object.keys(provider).length) {
        // get the milestones
        const milestones: unknown = await backlogService.getMilestones(
          provider.space_key,
          provider.api_key,
          project.project_id
        )
        const tempMilestones = milestones as Array<MilestonesInterface>

        let issuesList: { milestone: string; issues: IssuesInterface[] }[] = []
        for (const milestone of tempMilestones) {
          const issues: unknown = await backlogService.getIssues(
            provider.space_key,
            provider.api_key,
            milestone.id
          )
          const tempIssues = issues as Array<IssuesInterface>
          const issuesData = tempIssues.map((issue) => {
            return {
              id: issue.id,
              actualHours: issue.actualHours ? issue.actualHours : 0,
              estimatedHours: issue.estimatedHours ? issue.estimatedHours : 0,
              currentStatus: issue.status?.name
            }
          })
          issuesList.push({ milestone: milestone.name, issues: issuesData })
        }

        response = issuesList
      }
    }

    res.send(response)
  }
}

export default IssueController
