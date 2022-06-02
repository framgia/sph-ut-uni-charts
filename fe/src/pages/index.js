import { useState, useEffect } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import {
  Button,
  Group,
  Pagination,
  Select,
  Table,
  TextInput,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'

import HomePageDeleteModal from '../components/organisms/HomePageDeleteModal'
import { deleteProject, getProjects } from '@/src/api/providerApi'
import { providersSelectFieldValues } from '@/src/utils/constants'
import styles from '@/styles/index.module.css'

const Home = () => {
  const [projects, setProjects] = useState([])
  const [page, setPage] = useState(1)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState({})

  const { provider, searchProvider } = Router.query

  const [nameFilter, setNameFilter] = useState('')
  const [debouncedNameFilter] = useDebouncedValue(nameFilter, 500)
  const [userChangedNameFilter, setUserChangedNameFilter] = useState(false)

  const fetchProjects = () => {
    const params = {
      filterProvider: provider,
      searchProvider: searchProvider,
    }

    getProjects(params).then(({ data }) => {
      setProjects(data)
    })
  }

  const openDeleteModal = (project) => {
    setIsDeleteModalOpen(true)
    setSelectedProject(project)
  }

  const deleteSingleProject = async (id, provider) => {
    setIsDeleteModalOpen(false)
    const response = await deleteProject(id, provider)

    if (!response.message) {
      setProjects([])
      fetchProjects()
    }
  }

  const providerOnChange = (provider) => {
    Router.push({
      pathname: '/',
      query: { ...Router.query, provider },
    })
  }

  useEffect(() => {
    if (userChangedNameFilter) {
      if (Router.query.searchProvider) {
        delete Router.query.searchProvider
      }

      Router.push({
        pathname: '/',
        query: {
          ...Router.query,
          ...(debouncedNameFilter && { searchProvider: debouncedNameFilter }),
        },
      })
    }
  }, [debouncedNameFilter])

  const resetFilters = () => {
    Router.push('/')
    setNameFilter('')
  }

  useEffect(() => {
    setProjects([])
    fetchProjects()
  }, [provider, searchProvider])

  useEffect(() => {
    if (searchProvider) setNameFilter(searchProvider)
  }, [searchProvider])

  return (
    <>
      <Button
        onClick={() => (location.href = '/add-project')}
        className={styles['add-button']}
        my={10}
      >
        Add project
      </Button>
      <Group className={styles['group-wrapper']} key={searchProvider}>
        <Group grow className={styles.group}>
          <TextInput
            placeholder='Project Name'
            label='Filter by name'
            value={nameFilter}
            onChange={(event) => {
              setNameFilter(event.target.value)
              setUserChangedNameFilter(true)
            }}
          />
          <Select
            label='Filter by provider'
            placeholder='Provider'
            data={providersSelectFieldValues}
            value={provider}
            onChange={providerOnChange}
            key={provider}
          />
        </Group>
        <Button
          className={styles['reset-filters-button']}
          compact
          onClick={resetFilters}
        >
          Reset filters
        </Button>
      </Group>
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Provider</th>
            <th>Project ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            return (
              <tr key={project.id} role='project-trow'>
                <td>
                  <Link href={`/project-detail/${project.id}`}>
                    {project.name}
                  </Link>
                </td>
                <td>{project.provider.name}</td>
                <td>{project.id}</td>
                <td>
                  <Button color='red' onClick={() => openDeleteModal(project)}>
                    Delete
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <Pagination
        page={page}
        onChange={setPage}
        total={10}
        className={styles.pagination}
        getItemAriaLabel={(page) => {
          switch (page) {
            case 'dots':
              return 'dots'
            case 'prev':
              return 'previous page'
            case 'next':
              return 'next page'
            case 'first':
              return 'first page'
            case 'last':
              return 'last page'
            default:
              return `page ${page}`
          }
        }}
      />

      <HomePageDeleteModal
        isOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        deleteSingleProject={deleteSingleProject}
        selectedProject={selectedProject}
      />
    </>
  )
}

export default Home
