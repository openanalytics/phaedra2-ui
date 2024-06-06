import {ref} from 'vue'

const defaultFilterMethod = function () {
    return (rows, filter) => {
        return rows.filter(row => {
            for (const colName of Object.keys(filter)) {
                const term = String(filter[colName]?.term || "").toLowerCase();
                if (term == "") continue;

                const colDef = filter[colName].definition || {};

                let valueToCompare = row[colName];
                if (colDef.field) valueToCompare = row[colDef.field];
                if (colDef.format) valueToCompare = colDef.format(valueToCompare);

                if (!valueToCompare) {
                    // Some entity-specific cases
                    if (colName == "dimensions" && row.rows && row.columns) valueToCompare = `${row.rows} x ${row.columns}`
                }

                if (!String(valueToCompare || "").toLowerCase().includes(term)) {
                    return false;
                }
            }
            return true;
        })
    }
}

const makeFilter = function (tableColumns) {
    const filter = {};
    tableColumns.forEach(col => {
        filter[col.name] = {
            term: "",
            definition: col,
            enabled: col.label // Columns without label (i.e. action/menu columns) won't get a filter
        };
    });
    return ref(filter);
}

export default {
    defaultFilterMethod,
    makeFilter
}
