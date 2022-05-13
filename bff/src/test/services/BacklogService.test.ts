import BacklogService from '../../services/BacklogService'

const backlogService = new BacklogService()

describe('Backlog Service Test Suite', () => {
  test('Test #1: getProjectById - if ID exist in the database', async () => {
    const projects: any = await backlogService.getProjects()

    if (!projects.length) {
      expect(projects).toStrictEqual([])
    } else {
      const project: any = await backlogService.getProjectById(`/${projects[0].id}`)
      expect(project).toHaveProperty('id')
    }
  })

  test('Test #2: getProjectById - if ID does not exist in the database', async () => {
    const project: any = await backlogService.getProjectById('/111111')
    expect(project).toHaveProperty('message', 'No Data Found')
  })

  test('Test #3: getProjectById - invalid ID, letters are not valid', async () => {
    const project: any = await backlogService.getProjectById('/test')
    expect(project).toHaveProperty('message', 'Invalid ID')
  })

  test('Test #4: getProjects - fetch all projects', async () => {
    const projects: any = await backlogService.getProjects()
    if (!projects.length) expect(projects).toStrictEqual([])
    else expect(projects[0]).toHaveProperty('id')
  })

  test('Test #5: deleteProjectById - if ID does not exist in the database', async () => {
    const project: any = await backlogService.deleteProjectById('/111111')
    expect(project).toHaveProperty('message', 'ID does not exist')
  })

  test('Test #6: deleteProjectById - invalid ID, letters are not valid, should be number', async () => {
    const project: any = await backlogService.deleteProjectById('/test')
    expect(project).toHaveProperty('message', 'Invalid ID')
  })

})
