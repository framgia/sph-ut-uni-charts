const axios = require('axios')
const URL = process.env.BACKLOG_HOST

export default class BacklogService {
  async getProjects(payload: any) {
    return await axios({
      baseURL: URL,
      url: '/api/v2/projects',
      method: 'get',
      params: payload
    })
  }

  async getSpace(payload: any) {
    return await axios({
      baseURL: URL,
      url: '/api/v2/space',
      method: 'get',
      params: payload
    })
  }

  async getProject(payload: any) {
    return await axios({
      baseURL: URL,
      url: `/api/v2/projects/${payload.projectIdOrKey}`,
      method: 'get',
      params: { apiKey: payload.api_key }
    })
  }
}
