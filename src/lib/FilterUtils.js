import {ref} from 'vue'

const defaultFilterMethod = function () {
    return (rows, filter) => {
        return rows.filter(row => {
            for (const colName of Object.keys(filter)) {
                if (colName.startsWith("colDef.")) continue;
                const term = String(filter[colName] || "").toLowerCase();
                if (term == "") continue;
                
                const colDef = filter["colDef." + colName];

                let valueToCompare = row[colName];
                if (colDef.field) valueToCompare = row[colDef.field];
                if (colDef.format) valueToCompare = colDef.format(valueToCompare);

                if (!valueToCompare) {
                    // Some entity-specific cases
                    if (colName == "dimensions" && row.rows && row.columns) valueToCompare = `${row.rows}x${row.columns}`
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
        filter['colDef.' + col.name] = col;
        filter[col.name] = '';
    });
    return ref(filter);
}

export default {
    defaultFilterMethod,
    makeFilter
}
