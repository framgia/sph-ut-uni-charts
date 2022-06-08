import { useCallback } from 'react'
import Router from 'next/router'

const useHeader = ({ pagination = [] }) => {
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

  const totalPage =
    pagination?.page > pagination?.total_pages
      ? pagination?.page
      : pagination?.total_pages || '1'

  const pageOnChange = (value) => {
    Router.push({
      pathname: '/',
      query: {
        ...Router.query,
        page: value,
      },
    })
  }

  /**
   * @param any event
   * Event to watch when user type something in the field
   */
  const searchProviderOnChange = (event) => {
    if (event.target.value.length < 1) {
      updateRouter({ searchProvider: '' })
    }
  }

  /**
   * @param any event
   * Event to watch when user press enter key
   */
  const searchProviderOnKeyPress = (event) => {
    if (event.key === 'Enter') {
      updateRouter({ searchProvider: event.target.value })
    }
  }

  /**
   * @param String event
   * Event to watch when user changes filter option
   */
  const providerOnFilter = (value) => {
    updateRouter({ filterProviderName: value })
  }

  const resetFilters = () => {
    Router.push('/')
  }

  return {
    query,
    totalPage,
    searchProviderOnChange,
    searchProviderOnKeyPress,
    providerOnFilter,
    resetFilters,
    pageOnChange,
  }
}

export default useHeader
