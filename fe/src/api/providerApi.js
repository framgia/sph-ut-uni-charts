import axios from 'axios'
import { baseAuthApi } from './base'

const URL = process.env.NEXT_PUBLIC_BFF_API

export const getIssues = async (project_id, service) => {
  return await baseAuthApi.request({
    method: 'GET',
    url: `/issues/${project_id}`,
    params: { service },
  })
}

export const getProviders = async () => {
  return await baseAuthApi.request({
    method: 'GET',
    url: '/providers/',
  })
}

export const getBacklogProjects = async (payload) => {
  return await baseAuthApi.request({
    method: 'GET',
    url: '/backlog/projects',
    params: payload,
  })
}

export const addProvider = async (payload) => {
  return await baseAuthApi.request({
    method: 'POST',
    url: '/providers/add',
    data: payload,
  })
}

export const getActiveSprintData = async (project_id, service) => {
  return await baseAuthApi.request({
    method: 'GET',
    url: `/projects/${project_id}/active-sprint-data`,
    params: { service },
  })
}

export const deleteProject = async (project_id, service) => {
  return await baseAuthApi.request({
    method: 'DELETE',
    url: `projects/${project_id}`,
    params: { service },
  })
}

export const getProjects = async (params) => {
  return await baseAuthApi.request({
    method: 'GET',
    url: '/projects',
    params,
  })
}
