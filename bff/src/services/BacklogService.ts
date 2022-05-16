require('dotenv').config()
import axios, { AxiosResponse, AxiosError } from 'axios'

const URL = process.env.BACKLOG_API_SERVICE

export default class BacklogService {
  // PROJECTS ENDPOINT

  async getProjects(params: any) {
    let data

    await axios({
      url: `${URL}/projects`,
      method: 'get',
      params: params
    }).then((response: AxiosResponse) => {
      data = response.data
    })
    return data
  }

  async getProjectById(id: String) {
    let data

    await axios({
      url: `${URL}/projects/${id}`,
      method: 'get'
    }).then((response: AxiosResponse) => {
      data = response.data
    })

    return data
  }

  async deleteProjectById(id: String) {
    let data

    await axios({
      url: `${URL}/projects/${id}`,
      method: 'delete'
    }).then((response: AxiosResponse) => {
      data = response.data
    })

    return data
  }

  // PROVIDERS ENDPOINT

  static async add(payload: any) {
    return await axios
      .post(`${URL}/providers/add`, { ...payload })
      .then((response: AxiosResponse) => {
        return response
      })
      .catch((error) => {
        return error.response
      })
  }

  static async getProviders(payload: any) {
    return await axios({
      url: `${URL}/providers/`,
      method: 'get',
      params: payload
    })
  }

  async getProviderById(id: any) {
    return await axios
      .get(`${URL}/providers/${id}`)
      .then((response: AxiosResponse) => {
        return response.data
      })
      .catch((error: AxiosError) => {
        return error.message
      })
  }

  // WILL CONNECT TO BACKLOG API (not microservice)

  async getIssues(space_key: String, api_key: string, milestone_id?: number) {
    let data
    let url = `https://${space_key}.backlog.com/api/v2/issues?apiKey=${api_key}${
      milestone_id ? `&milestoneId[]=${milestone_id}` : ''
    }`

    await axios
      .get(url)
      .then((response: AxiosResponse) => {
        data = response.data
      })
      .catch((error) => {
        data = { errors: error.response.data, status: error.response.status }
      })
    return data
  }

  async getMilestones(space_key: String, api_key: string, project_id: number) {
    let data
    await axios
      .get(
        `https://${space_key}.backlog.com/api/v2/projects/${project_id}/versions?apiKey=${api_key}`
      )
      .then((response: AxiosResponse) => {
        data = response.data
      })
      .catch((error) => {
        data = { errors: error.response.data, status: error.response.status }
      })
    return data
  }

  // BACKLOG ENDPOINT

  static async backlogProjects(payload: any) {
    return await axios({
      baseURL: URL,
      url: '/backlog/projects',
      method: 'get',
      params: payload
    })
  }

  async getActiveSprintData(
    space_key: string,
    key: string,
    project_id: number,
    milestone_id: number
  ) {
    let data

    await axios({
      baseURL: `https://${space_key}.backlog.com/api/v2`,
      url: '/issues',
      method: 'get',
      params: { apiKey: key, 'projectId[]': project_id, 'milestoneId[]': milestone_id }
    }).then((response: AxiosResponse) => {
      data = response.data
    })
    return data
  }
}
