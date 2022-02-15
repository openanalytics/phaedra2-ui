/**
 * Default table filter method
 * @param rows
 * @param term
 * @returns {*}
 */
const defaultTableFilter = function () {
    return (rows, term) => {
        return rows.filter(row => {
            for (const key of Object.keys(row)) {
                const comp = String(term).toLowerCase()
                //If a row element contains the filter, return true
                if (String(row[key]).toLowerCase().includes(comp)) {
                    return true
                }
            }
            //If no row element contains the filter, return false
            return false
        })
    }
}

export default {
    defaultTableFilter
}