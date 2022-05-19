import BacklogService from '../services/BacklogService'
import { Request, Response } from 'express'
import { DateTime } from 'luxon'

const backlogService = new BacklogService()

export default class ProjectController {
  async getProjects(req: Request, res: Response) {
    const result = await backlogService.getProjects(req.query)
    res.send(result)
  }

  async getProjectById(req: Request, res: Response) {
    let response

    switch (req.body.service) {
      case 'backlog':
        const result = await backlogService.getProjectById(req.params.id)
        response = result
        break
      default:
        response = { message: 'Service information not provided.' }
    }

    res.send(response)
  }

  async deleteProjectById(req: Request, res: Response) {
    let response

    switch (req.query.service) {
      case 'backlog':
        const result = await backlogService.deleteProjectById(req.params.id)
        response = result
        break
      default:
        response = { message: 'Service information is not provided.' }
    }

    res.send(response)
  }

  async getActiveSprintData(req: Request, res: Response) {
    const projId = req.params.id
    let response

    switch (req.query.service) {
      case 'backlog':
        let dates: any[]
        let estimated = [] as any
        let actual = [] as any

        let totalET = 0
        let closedET = 0
        let estimatedET = 0

        const { project_id, provider_id }: any = await backlogService.getProjectById(projId)
        const { space_key, api_key }: any = await backlogService.getProviderById(provider_id)
        const milestones: any = await backlogService.getMilestones(space_key, api_key, project_id)

        const activeSprint = milestones.find((milestone: any) => {
          const releaseDate = new Date(milestone.releaseDueDate).toLocaleDateString()
          const dateNow = DateTime.now().toLocaleString()
          if (releaseDate >= dateNow) {
            return milestone
          }
        })

        const { startDate, releaseDueDate, id } = activeSprint
        // Get day before startDate //
        let dateBefore = DateTime.fromISO(startDate).minus({ days: 1 }).toLocaleString()
        const issues: any = await backlogService.getActiveSprintData(
          space_key,
          api_key,
          project_id,
          id
        )

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

        dates.forEach((date) => {
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
        })

        response = {
          dates: dates,
          data: { estimated, actual }
        }

        break
      default:
        response = { message: 'Service information not provided.' }
    }

    res.send(response)
  }
}
