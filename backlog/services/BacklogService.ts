const axios = require('axios')
const URL = process.env.BACKLOG_HOST

export default class BacklogService {
  async getProjects(apiKey: any) {
    return await axios({
      baseURL: URL,
      url: '/api/v2/projects',
      method: 'get',
      params: { apiKey }
    })
  }
}
