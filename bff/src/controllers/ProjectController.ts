import Controller from './Controller'
import BacklogService from '../services/BacklogService'
import { Request, Response } from 'express'
import { DateTime } from 'luxon'
import { errorWithCustomMessage } from '../utils/helpers'
import { IssuesInterface } from '../utils/interfaces'
const backlogService = new BacklogService()

export default class ProjectController extends Controller {
  async getProjects(req: Request, res: Response) {
    try {
      const user = await super.user({ email: req.header('authorization') as string })

      req.query.user_id = user.id

      const result = await backlogService.getProjects(req.query)
      res.send(result)
    } catch (error: any) {
      const response = JSON.parse(error.message)
      res.status(response.status || 500).json(response.errors || error)
    }
  }

  async getProjectById(req: Request, res: Response) {
    let response
    try {
      const user = await super.user({ email: req.header('authorization') as string })

      switch (req.query.service) {
        case 'backlog':
          response = await backlogService.getProjectById(req.params.id, {
            user_id: user.id
          })

          break
        default:
          errorWithCustomMessage(400, { message: 'Service information not provided.' })
      }
      res.send(response)
    } catch (error: any) {
      const response = JSON.parse(error.message)
      res.status(response.status || 500).json(response.errors || error)
    }
  }

  async deleteProjectById(req: Request, res: Response) {
    let response
    try {
      const user = await super.user({ email: req.header('authorization') as string })

      switch (req.query.service) {
        case 'backlog':
          response = (await backlogService.deleteProjectById(req.params.id, {
            user_id: user.id
          })) as any

          break
        default:
          errorWithCustomMessage(400, { message: 'Service information is not provided.' })
      }

      res.send(response)
    } catch (error: any) {
      const response = JSON.parse(error.message)
      res.status(response.status || 500).json(response.errors || error)
    }
  }

  async getActiveSprintData(req: Request, res: Response) {
    let response

    try {
      const user = await super.user({ email: req.header('authorization') as string })

      const projId = req.params.id
      if (!projId) errorWithCustomMessage(400, { message: 'Project ID is not provided' })

      switch (req.query.service) {
        case 'backlog':
          let dates: any[], milestones: any
          let estimated = [] as any
          let actual = [] as any

          const total: number[] = [],
            completed: number[] = []

          let totalET = 0
          let closedET = 0
          let estimatedET = 0

          const { project_id, provider_id } = (await backlogService.getProjectById(projId, {
            user_id: user.id
          })) as any

          const { space_key, api_key } = (await backlogService.getProviderById(provider_id)) as any

          milestones = await backlogService.getMilestones(space_key, api_key, project_id)
          if (!milestones.length) {
            errorWithCustomMessage(404, { message: 'No milestone found' })
          }

          // reverse the milestones since it starts from latest first [sprint 4, sprint 3,...]
          // if there are multiple unfinished sprint, calling .find() will always return the latest sprint
          milestones.reverse()

          const activeSprint = milestones.find((milestone: any) => {
            const releaseDate = DateTime.fromISO(milestone.releaseDueDate).toMillis()
            const dateNow = DateTime.now().startOf('day').toMillis()

            if (releaseDate >= dateNow) {
              return milestone
            }
          })

          if (!activeSprint) {
            errorWithCustomMessage(404, { message: 'No active sprint found' })
          }

          const { startDate, releaseDueDate, id } = activeSprint
          // Get day before startDate //
          let dateBefore = DateTime.fromISO(startDate).minus({ days: 1 }).toLocaleString()
          const issues: IssuesInterface[] = await backlogService.getActiveSprintData(
            space_key,
            api_key,
            project_id,
            id
          )
          if (!issues.length) errorWithCustomMessage(404, { message: 'No issues found' })

          // Get dates in between startDate and releaseDueDate //
          for (
            var arr = [], dt = new Date(dateBefore);
            dt <= new Date(releaseDueDate);
            dt.setDate(dt.getDate() + 1)
          ) {
            arr.push(new Date(dt).toLocaleDateString())
          }
          dates = arr

          // Get initial total ET of sprint
          issues.forEach((issue: any) => {
            totalET = totalET + issue.estimatedHours
          })

          dates?.forEach((date, index) => {
            // for burn down chart
            const estimatedIssues = issues.filter((issue: any) => {
              let dueDate = new Date(issue.dueDate).toLocaleDateString()
              if (dueDate === date) {
                return issue
              }
            })

            estimatedIssues.forEach((estimated: any) => {
              estimatedET = estimatedET += estimated.estimatedHours
            })

            const closedOnUpdate = issues.filter((issue: any) => {
              let updatedAt = new Date(issue.updated).toLocaleDateString()
              if (updatedAt === date && issue.status.name === 'Closed') {
                return issue
              }
            })

            closedOnUpdate?.forEach((remaining: any) => {
              closedET = closedET += remaining.estimatedHours
            })

            actual.push(totalET - closedET)
            estimated.push(totalET - estimatedET)

            // for burn up chart
            total[index] = 0
            completed[index] = 0

            issues.forEach((issue) => {
              const currentDate = DateTime.fromFormat(date, 'D').endOf('day').toMillis()
              const issueCreatedDate = DateTime.fromISO(issue.created as string).toMillis()
              const issueUpdatedDate = DateTime.fromISO(issue.updated as string).toMillis()

              if (currentDate > issueCreatedDate) {
                total[index] += issue.estimatedHours
              }

              if (issue.status!.name === 'Closed' && currentDate > issueUpdatedDate) {
                completed[index] += issue.estimatedHours
              }
            })
          })

          response = {
            dates: dates,
            data: { estimated, actual },
            burnUpChartData: { total, completed }
          }

          break
        default:
          errorWithCustomMessage(400, { message: 'Service information not provided.' })
      }

      res.send(response)
    } catch (error: any) {
      const response = JSON.parse(error.message)
      res.status(response.status || 500).json(response.errors || error)
    }
  }
}
