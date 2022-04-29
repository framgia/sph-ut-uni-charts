// const { PrismaClient } = require()
import { PrismaClient } from '@prisma/client'
import { Duration } from 'luxon'
import axios from 'axios'

class WebhookController {
  public async getData(req: any, res: any) {
    try {
      const {
        description,
        timeInterval: { duration }
      } = req.body
      // const projectKey = this.getProjectKey(description)
      const issueKey = description.split(' ')[0]
      const getTotalHours = (Duration.fromISO(duration).toFormat('m') as any) / 60

      await axios.patch(
        `https://framgiaph.backlog.com/api/v2/issues/${issueKey}?apiKey=glRPwgfsVAXRLIJ4sJWlCoNCNCs85PIPy8Y9LX0UesqEGStUDDzRh0sjTBSC28Bf`,
        {
          actualHours: getTotalHours
        }
      )

      console.log('success')
      res.send('Success')
    } catch (error) {
      return res.send({
        message: (error as Error).message
      })
    }
  }
}

export default WebhookController
