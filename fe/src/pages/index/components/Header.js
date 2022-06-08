import { useCallback, Fragment } from 'react'
import { Button, Group, Pagination, Select, TextInput } from '@mantine/core'

import { providersSelectFieldValues } from '@/src/utils/constants'
import useHeader from '@/src/hooks/useHeader'
import styles from '@/styles/index.module.css'

const Header = ({ pagination }) => {
  const {
    query,
    totalPage,
    searchProviderOnChange,
    searchProviderOnKeyPress,
    providerOnFilter,
    resetFilters,
    pageOnChange,
  } = useHeader({ pagination })

  return (
    <Fragment>
      <Group className={styles['group-wrapper']} key={query}>
        <Group grow className={styles.group}>
          <TextInput
            wrapperProps={{ role: 'project-input-field' }}
            autoFocus='autofocus'
            placeholder='Project Name'
            label='Filter by name'
            defaultValue={query.searchProvider}
            key={`search-${query.searchProvider}`}
            onKeyPress={searchProviderOnKeyPress}
            onChange={searchProviderOnChange}
          />
          <Select
            id='provider-select-option'
            wrapperProps={{ role: 'project-select-field' }}
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

      <div className={styles['pagination-container']} role='pagination'>
        <Pagination
          data-testid='project-list'
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
    </Fragment>
  )
}

export default Header
