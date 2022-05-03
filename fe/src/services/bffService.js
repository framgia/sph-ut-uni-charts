import axios from 'axios'

const URL = 'http://localhost:11000/api'

export const getIssues = async (project_id, provider) => {
  let data
  await axios
    .get(`${URL}/issues/${project_id}?service=${provider}`)
    .then((response) => {
      data = response.data
    })

  return data
}

export const getSprints = async (project_id, provider) => {
  let data
  await axios
    .get(`${URL}/projects/${project_id}/milestones?service=${provider}`)
    .then((response) => {
      data = response.data
    })

  return data
}

export const getIssuesRelatedToSprint = async (
  project_id,
  milestoneId,
  provider
) => {
  console.log(project_id, milestoneId, provider)
  let data
  await axios
    .get(
      `${URL}/projects/${project_id}/${milestoneId}/issues?service=${provider}`
    )
    .then((response) => {
      data = response.data
    })

  return data
}
