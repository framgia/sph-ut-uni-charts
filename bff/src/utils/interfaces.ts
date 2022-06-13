import { Response } from 'express'

export interface ProviderInterface {
  user_id: any
  provider: string
  space_key: string
  api_key: any
  project_key: string
  project_name: string
  project_id: any
}

export interface ProjectInterface {
  id: number
  name: string
  key: string
  project_id: number
  provider_id: number
  provider: ProviderInterface
  message?: string
}

export interface IssuesInterface {
  id: number
  estimatedHours: number
  actualHours: number
  milestone?: Array<any>
  status?: {
    name: string
  }

  // this will be used by the FE
  // removing undefined will cause type errors
  currentStatus: string | undefined
}

export interface MilestonesInterface {
  id: number
  name: string
}

export interface CustomTypedResponse extends Response {
  statusCode: any
  _getData: () => any
  _getJSONData: () => any
}

export type getUserInterface = {
  email: string
}

export interface DevInfoInterface {
  id: number
  userId: string
  name: string
  roleType: number
  lang: string
  mailAddress: string
  nulabAccount: {
    nulabId: string
    name: string
    uniqueId: string
  }
  keyword: string
}
