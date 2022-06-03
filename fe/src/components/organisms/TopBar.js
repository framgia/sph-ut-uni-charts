import { useCallback } from 'react'
import { Button, Group, Select, TextInput } from '@mantine/core'
import Router from 'next/router'

import { providersSelectFieldValues } from '@/src/utils/constants'
import styles from '@/styles/index.module.css'

const TopBar = () => {
  const query = Router.query

  const updateRouter = useCallback(
    ({ page = 1, searchProvider, filterProviderName }) => {
      Router.push({
        pathname: '/',
        query: {
          ...query,
          ...(typeof searchProvider === 'string' ? { searchProvider } : {}),
          ...(filterProviderName ? { filterProviderName } : {}),
          page,
        },
      })
    },
    [query]
  )

  const providerOnSearch = (event) => {
    if (event.target.value.length < 1) {
      updateRouter({ searchProvider: '' })
    }
  }

  const providerSearchOnKeyPress = (event) => {
    if (event.key === 'Enter') {
      updateRouter({ searchProvider: event.target.value })
    }
  }

  const providerOnFilter = (value) => {
    updateRouter({ filterProviderName: value })
  }

  const resetFilters = () => {
    Router.push('/')
  }

  return (
    <Group className={styles['group-wrapper']} key={query}>
      <Group grow className={styles.group}>
        <TextInput
          autoFocus='autofocus'
          placeholder='Project Name'
          label='Filter by name'
          defaultValue={query.searchProvider}
          key={`search-${query.searchProvider}`}
          onKeyPress={providerSearchOnKeyPress}
          onChange={providerOnSearch}
        />
        <Select
          label='Filter by provider'
          placeholder='Provider'
          data={providersSelectFieldValues}
          value={query.filterProviderName}
          onChange={providerOnFilter}
          key={`filter-${query.filterProviderName}`}
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
  )
}

export default TopBar
