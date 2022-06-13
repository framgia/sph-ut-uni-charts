import { Request, Response } from 'express'
import BacklogService from '../services/BacklogService'
import {
  DevInfoInterface,
  IssuesInterface,
  MilestonesInterface,
  ProjectInterface,
  ProviderInterface
} from '../utils/interfaces'
import { errorWithCustomMessage } from '../utils/helpers'
import Controller from './Controller'

const backlogService = new BacklogService()

class DeveloperController extends Controller {
  async getDeveloperInfo(req: Request, res: Response) {
    try {
      let response
      const user = await super.user({ email: req.header('authorization') as string })

      if (/[^0-9]/.test(req.params.developer_id)) {
        errorWithCustomMessage(400, { message: 'Invalid developer ID' })
      }
      const developer_id = Number(req.params.developer_id)

      const project_id = req.query.project_id
      if (!project_id) errorWithCustomMessage(400, { message: 'Project ID not provided.' })

      switch (req.query.service) {
        case 'backlog':
          // get the project
          const project: ProjectInterface = (await backlogService.getProjectById(
            String(project_id),
            {
              user_id: user.id
            }
          )) as any

          // get the provider
          const provider: ProviderInterface = await backlogService.getProviderById(
            project.provider_id
          )

          const devInfo: DevInfoInterface = await backlogService.getDeveloperInfo(
            provider.space_key,
            provider.api_key,
            developer_id
          )

          const issues: IssuesInterface[] = await backlogService.getIssues(
            provider.space_key,
            provider.api_key,
            undefined,
            developer_id,
            project.project_id
          )

          if (issues.length === 0) {
            errorWithCustomMessage(404, { message: 'No issues found' })
          }

          const milestones: MilestonesInterface[] = await backlogService.getMilestones(
            provider.space_key,
            provider.api_key,
            project.project_id
          )
          if (milestones.length === 0)
            errorWithCustomMessage(404, { message: 'No milestones found' })

          let velocity = 0,
            closed = 0,
            closedOntime = 0,
            movedIssue = 0

          issues.forEach((issue) => {
            if (issue.milestone!.length < 2) {
              movedIssue += 1
            }
            if (issue.status!.name === 'Closed') {
              velocity += issue.estimatedHours
              closed += 1

              if (issue.milestone!.length < 2) {
                closedOntime += 1
              }
            }
          })

          velocity = velocity / milestones.length
          const closedOnTimePercentage = ((closedOntime / closed) as any).toFixed(4) * 100
          const movedIssuePercentage = ((movedIssue / issues.length) as any).toFixed(4) * 100

          response = { name: devInfo.name, velocity, closedOnTimePercentage, movedIssuePercentage }

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

  async getDeveloperIcon(req: Request, res: Response) {
    try {
      let response
      const user = await super.user({ email: req.header('authorization') as string })

      if (/[^0-9]/.test(req.params.developer_id)) {
        errorWithCustomMessage(400, { message: 'Invalid developer ID' })
      }
      const developer_id = Number(req.params.developer_id)

      const project_id = req.query.project_id as string
      if (!project_id) errorWithCustomMessage(400, { message: 'Project ID not provided.' })

      switch (req.query.service) {
        case 'backlog':
          // get the project
          const project: ProjectInterface = (await backlogService.getProjectById(project_id, {
            user_id: user.id
          })) as any

          // get the provider
          const provider: ProviderInterface = await backlogService.getProviderById(
            project.provider_id
          )

          response = await backlogService.getDeveloperIcon(
            provider.space_key,
            provider.api_key,
            developer_id
          )

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

export default DeveloperController
