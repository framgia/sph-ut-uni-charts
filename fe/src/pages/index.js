import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import {
  Button,
  Container,
  Group,
  Pagination,
  Select,
  Table,
  Text,
  TextInput,
} from '@mantine/core'

import Navbar from '../components/molecules/Navbar'
import { deleteProject, getProjects } from '@/src/services/bffService'
import { providersSelectFieldValues } from '@/src/utils/constants'
import styles from '@/styles/index.module.css'

const Home = () => {
  const [projects, setProjects] = useState([])
  const [page, setPage] = useState(1)
  const { provider, searchProvider } = Router.query

  const fetchProjects = () => {
    const params = {
      filterProvider: provider,
      searchProvider: searchProvider,
    }

    getProjects(params).then((response) => {
      setProjects(response)
    })
  }

  const deleteSingleProject = async (id, provider) => {
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

  const providerOnSearch = (event) => {
    if (event.key === 'Enter') {
      const value = event.target.value

      Router.push({
        pathname: '/',
        query: { ...Router.query, searchProvider: value },
      })
    }
  }

  const resetFilters = () => Router.push('/')

  useEffect(() => {
    setProjects([])
    fetchProjects()
  }, [provider, searchProvider])

  return (
    <Container>
      <Head>
        <title>Uni Chart</title>
      </Head>

      <main>
        <Navbar />

        <Text color='blue'>
          <h1>Welcome to Uni Chart!</h1>
        </Text>
        <Button
          onClick={() => (location.href = '/add-project')}
          className={styles['add-button']}
        >
          Add project
        </Button>
        <Group className={styles['group-wrapper']} key={searchProvider}>
          <Group grow className={styles.group}>
            <TextInput
              placeholder='Project Name'
              label='Filter by name'
              defaultValue={searchProvider}
              onKeyPress={providerOnSearch}
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
                  <td>{project.memberCount}</td>
                  <td>
                    <Button
                      color='red'
                      onClick={() => {
                        deleteSingleProject(
                          project.id,
                          project.provider.name.toLowerCase()
                        )
                      }}
                    >
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
      </main>
    </Container>
  )
}

export default Home
