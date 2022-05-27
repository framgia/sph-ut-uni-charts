import { IProject } from 'interfaces/Project'

export const testData: IProject[] = [
  {
    id: 187,
    name: 'Backlog',
    key: 'backlog_311',
    project_id: 33133,
    provider_id: 183,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 188,
    name: 'Mailtrap',
    key: 'mailtrap_io33',
    project_id: 355,
    provider_id: 184,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 189,
    name: 'Trello',
    key: 'trello_key',
    project_id: 355,
    provider_id: 185,
    created_at: new Date(),
    updated_at: new Date()
  }
]

export const mockedProviderResponse = {
  id: 1,
  user_id: 1,
  name: 'Backlog',
  space_key: 'UNI-CHART',
  api_key: 'apikey1234567890',
  created_at: new Date(),
  updated_at: new Date(),
  projects: [
    {
      id: 1,
      name: 'project_name',
      key: 'unichart-key',
      project_id: 99846,
      provider_id: 1,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]
}

export const mockedProjectResponse = {
  id: 1,
  name: 'project_name',
  key: 'unichart-key',
  project_id: 99846,
  provider_id: 1,
  created_at: new Date(),
  updated_at: new Date(),
  provider: {
    id: 1,
    user_id: 1,
    name: 'Backlog',
    space_key: 'UNI-CHART',
    api_key: 'apikey1234567890',
    created_at: new Date(),
    updated_at: new Date()
  }
}

export const addProjPayload = {
  user_id: 1,
  name: 'Backlog',
  api_key: 'apikey1234567890',
  project_id: 123
}
