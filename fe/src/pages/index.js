import Head from 'next/head'
import Link from 'next/link'
import { Button, Container, Group, Pagination, Select, Table, Text, TextInput } from '@mantine/core'
import styles from '@/styles/index.module.css'

import { providersSelectFieldValues } from '@/src/utils/constants'
import { staticProjects } from '@/src/utils/dummyData'
import { useState } from 'react'

import Navbar from '../components/molecules/Navbar'

const Home = () => {
  const [projectName, setProjectName] = useState('')
  const [providerName, setProviderName] = useState('')
  const [page, setPage] = useState(1)

  const resetFilters = () => {
    setProjectName('')
    setProviderName('')
  }

  return (
    <Container>
      <Head>
        <title>Uni Chart</title>
      </Head>

      <main>
        <Navbar />

        <Text color="blue">
          <h1>Welcome to Uni Chart!</h1>
        </Text>
        <Button onClick={() => (location.href = '/add-project')} className={styles['add-button']}>
          Add project
        </Button>
        <Group className={styles['group-wrapper']}>
          <Group grow className={styles.group}>
            <TextInput
              placeholder="Project Name"
              label="Filter by name"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value)
              }}
            />
            <Select
              label="Filter by provider"
              placeholder="Provider"
              data={providersSelectFieldValues}
              value={providerName}
              onChange={(e) => {
                setProviderName(e)
              }}
            />
          </Group>
          <Button className={styles['reset-filters-button']} compact onClick={resetFilters}>
            Reset filters
          </Button>
        </Group>
        <Table striped>
          <thead>
            <tr>
              <th>Name</th>
              <th>Provider</th>
              <th>Member Count</th>
            </tr>
          </thead>
          <tbody>
            {staticProjects.map((project) => {
              return (
                <tr key={`${project.name}_${project.provider}`}>
                  <td>
                    <Link href={`/project-detail/${project.id}`}>{project.name}</Link>
                  </td>
                  <td>{project.provider}</td>
                  <td>{project.memberCount}</td>
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
