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
    let status = 200

    switch (req.query.service) {
      case 'backlog':
        const result = (await backlogService.getProjectById(req.params.id)) as any

        if (result.errors) {
          status = result.status
          response = result.errors
        } else {
          response = result
        }
        break
      default:
        status = 400
        response = { message: 'Service information not provided.' }
    }

    if (status !== 200) {
      res.status(status).json(response)
    } else {
      res.send(response)
    }
  }

  async deleteProjectById(req: Request, res: Response) {
    let response

    switch (req.query.service) {
      case 'backlog':
        const result = await backlogService.deleteProjectById(req.params.id)
        response = result
        break
      default:
        response = { status: 400, errors: { message: 'Service information is not provided.' } }
    }

    if (response?.errors) {
      res.status(response.status).json(response.errors)
    } else {
      res.send(response)
    }
  }

  async getActiveSprintData(req: Request, res: Response) {
    let status = 200
    let response

    switch (req.query.service) {
      case 'backlog':
        let dates: any[], proj: any, milestones: any
        let estimated = [] as any
        let actual = [] as any

        let totalET = 0
        let closedET = 0
        let estimatedET = 0

        proj = await backlogService.getProjectById(req.params.id)
        if (proj.errors) {
          status = proj.status
          response = proj.errors
          break
        }
        const { project_id, provider_id } = proj

        const providerResponse: any = await backlogService.getProviderById(provider_id)
        if (providerResponse.errors) {
          status = providerResponse.status
          response = providerResponse.errors
          break
        }
        const { space_key, api_key } = providerResponse

        milestones = await backlogService.getMilestones(space_key, api_key, project_id)
        if (milestones.errors) {
          status = milestones.status
          response = milestones.errors
          break
        }

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

        if (issues.errors) {
          status = issues.status
          response = issues.errors
          break
        }

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
        status = 400
    }

    res.status(status).json(response)
  }
}
