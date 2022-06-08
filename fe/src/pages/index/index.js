import { useState, useEffect } from 'react'
import { Button, Pagination } from '@mantine/core'
import Router from 'next/router'

import { getProjects } from '@/src/api/providerApi'
import TableList from '@/src/components/molecules/TableList'
import Header from './components/Header'
import styles from '@/styles/index.module.css'

const Home = () => {
  const { filterProviderName, searchProvider, page, rel } = Router.query
  const [pagination, setPagination] = useState(null)
  const [projects, setProjects] = useState([])
  const [isFetching, setIsFetching] = useState(true)

  const fetchProjects = () => {
    setIsFetching(true)

    const params = {
      filterProviderName,
      searchProvider,
      page: page,
    }

    getProjects(params).then((response) => {
      setPagination(response.data)
      setProjects(response.data)
      setIsFetching(false)
    })
  }

  useEffect(() => {
    fetchProjects()
  }, [filterProviderName, searchProvider, page, rel])

  return (
    <>
      <Button
        onClick={() => (location.href = '/add-project')}
        className={styles['add-button']}
        my={10}
      >
        Add project
      </Button>

      <Header pagination={pagination} />

      <TableList list={projects.data} loading={isFetching} />
    </>
  )
}

export default Home
