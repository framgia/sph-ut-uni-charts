import { useState, useEffect } from 'react'
import { Button, Pagination } from '@mantine/core'
import Router from 'next/router'

import { getProjects } from '@/src/api/providerApi'
import TableList from '../components/molecules/TableList'
import TopBar from '../components/organisms/TopBar'

import styles from '@/styles/index.module.css'

const Home = () => {
  const { filterProviderName, searchProvider, page, rel } = Router.query
  const [pagination, setPagination] = useState(null)
  const [projects, setProjects] = useState([])
  const [isFetching, setIsFetching] = useState(true)

  const totalPage =
    pagination?.page > pagination?.total_pages
      ? pagination?.page
      : pagination?.total_pages || '1'

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

  const pageOnChange = (value) => {
    Router.push({
      pathname: '/',
      query: {
        ...Router.query,
        page: value,
      },
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

      <TopBar />

      <div className={styles['pagination-container']} role='pagination'>
        <Pagination
          page={pagination?.page || '1'}
          total={totalPage}
          onChange={pageOnChange}
          className={styles['pagination']}
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
      </div>

      <TableList list={projects.data} loading={isFetching} />
    </>
  )
}

export default Home
