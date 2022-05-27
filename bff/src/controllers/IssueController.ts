import { Request, Response } from 'express'
import BacklogService from '../services/BacklogService'
import {
  IssuesInterface,
  ProjectInterface,
  ProviderInterface,
  MilestonesInterface
} from '../utils/interfaces'
import Controller from './Controller'

const backlogService = new BacklogService()

class IssueController extends Controller {
  async getIssues(req: Request, res: Response) {
    const user = await super.user({ email: req.header('authorization') as string })
    let response
    let project: ProjectInterface = {} as ProjectInterface
    let provider: ProviderInterface = {} as ProviderInterface
    let status = 200

    switch (req.query.service) {
      case 'backlog':
        // get the project
        const projectResponse: any = await backlogService.getProjectById(req.params.id, {
          user_id: user.id
        })
        if (projectResponse.errors) {
          status = projectResponse.status
          response = projectResponse.errors
          break
        }
        project = projectResponse as ProjectInterface

        // get the provider
        const providerResponse: any = await backlogService.getProviderById(project.provider_id)
        if (providerResponse.errors) {
          status = providerResponse.status
          response = providerResponse.errors
          break
        }
        provider = providerResponse

        // get the milestones
        const milestonesResponse: any = await backlogService.getMilestones(
          provider.space_key,
          provider.api_key,
          project.project_id
        )
        if (milestonesResponse.errors) {
          status = milestonesResponse.status
          response = milestonesResponse.errors
          break
        }
        const milestones: MilestonesInterface[] = milestonesResponse

        let issuesList: { milestone: string; issues: IssuesInterface[] }[] = []

        // get issues for each milestone
        for (const milestone of milestones) {
          const issuesResponse: any = await backlogService.getIssues(
            provider.space_key,
            provider.api_key,
            milestone.id
          )
          if (issuesResponse.errors) {
            status = issuesResponse.status
            response = issuesResponse.errors
            break
          }
          const issues = issuesResponse as Array<IssuesInterface>

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
        if (status === 200) response = issuesList

        break
      default:
        response = { message: 'Service information not provided.' }
        status = 400
    }

    res.status(status).json(response)
  }
}

export default IssueController
