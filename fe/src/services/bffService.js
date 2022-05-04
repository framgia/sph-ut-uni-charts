import axios from 'axios'

const URL = process.env.NEXT_PUBLIC_BE_APP

export const getIssues = async (project_id, provider) => {
  let data
  await axios
    .get(`${URL}/api/issues/${project_id}?service=${provider}`)
    .then((response) => {
      data = response.data
    })

  return data
}

export const getProviders = async (payload) => {
  return await axios.get(`${URL}/api/providers/`, { params: payload })
}

export const getBacklogProjects = async (payload) => {
  return await axios.get(`${URL}/api/backlog/projects`, { params: payload })
}

export const addProvider = async (payload) => {
  return await axios.post(`${URL}/api/providers/add`, payload)
}
