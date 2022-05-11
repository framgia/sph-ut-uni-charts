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
    let status = 200
    let error = false

    switch (req.query.service) {
      case 'backlog':
        const result: unknown = await backlogService.getProjectById(req.params.id)
        project = result as ProjectInterface
        break
      default:
        response = { message: 'Service information not provided.' }
        status = 400
        error = true
    }

    if (error) {
      res.status(status).json(response)
    } else if (project.message) {
      // if message exist, the service responded with an error
      // check what is the response message of the service
      switch (project.message) {
        case 'Invalid ID':
          res.status(400).json({ message: project.message })
          break
        default:
          // default case is data not found
          res.status(404).json({ message: project.message })
      }
    } else {
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

        // get issues for each milestone
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
      }

      res.send(response)
    }
  }
}

export default IssueController
