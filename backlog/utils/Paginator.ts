interface Props {
  page: number
  per_page: number
  prev_page: number | null
  next_page: number | null
  total: number
  total_pages: number
  data: Object
}

export default (items: Object[], page: number, per_page: number): Props => {
  let possiblePage = page

  while (items.length <= (possiblePage - 1) * 10) {
    --possiblePage
  }

  var page = possiblePage || 1,
    per_page = per_page || 10,
    offset = (possiblePage - 1) * per_page,
    paginatedItems = items.slice(offset).slice(0, per_page),
    total_pages = Math.ceil(items.length / per_page)

  return {
    page: page,
    per_page: per_page,
    prev_page: page - 1 ? page - 1 : null,
    next_page: total_pages > page ? page + 1 : null,
    total: items.length,
    total_pages: total_pages,
    data: paginatedItems
  }
}
