/**
 * Filters on some basic fields that most objects have (id, name, description, etc.).
 */
const createTableFilter = function() {
    return (rows, term) => {
        return rows.filter(row => {
          return (
              (row.id && row.id == term)
              || (row.name && row.name.toLowerCase().includes(term.toLowerCase()))
              || (row.description && row.description.toLowerCase().includes(term.toLowerCase()))
              || (row.tags && row.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase())))
            )
        })
      }
}

export default {
    createTableFilter
}