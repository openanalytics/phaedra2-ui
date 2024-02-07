import {ref} from 'vue'

const defaultFilterMethod = function () {
    return (rows, filter) => {
        return rows.filter(row => {
            for (const colName of Object.keys(filter)) {
                const term = String(filter[colName] || "").toLowerCase();
                if (term == "") continue;
                if (!String(row[colName]).toLowerCase().includes(term)) {
                    return false;
                }
            }
            return true;
        })
    }
}

const makeFilter = function (tableColumns) {
    const filter = {};
    tableColumns.forEach(col => filter[col.name] = '');
    return ref(filter);
}

export default {
    defaultFilterMethod,
    makeFilter
}
