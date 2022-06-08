import Project from '../../models/Project'
import ProviderSeeder from '../../seeders/ProviderSeeder'
import ProjectSeeder from '../../seeders/ProjectSeeder'
import projectTest from '../../seeders/const/project.json'

const providerSeeder = new ProviderSeeder()
const projectSeeder = new ProjectSeeder()

describe('When using Project Model', () => {
  beforeAll(async () => {
    await providerSeeder.run()
    await projectSeeder.run()
  })

  afterAll(async () => {
    await projectSeeder.undoChanges()
    await providerSeeder.undoChanges()
  })

  it('should search wildcard by project name', async () => {
    const searchValue = 'proj3_'
    const records = await Project.projectsWithParams({
      ...projectTest.payload,
      searchProvider: searchValue
    })

    records.map((data) => {
      expect(data.name).toContain(searchValue)
    })
  })

  it('should filter projects by provider', async () => {
    const filterValue = 'Backlog'
    const records = await Project.projectsWithParams({
      ...projectTest.payload,
      filterProviderName: filterValue
    })

    records.map((data) => {
      expect(data.provider?.name.toLowerCase()).toContain(filterValue.toLowerCase())
    })
  })
})
