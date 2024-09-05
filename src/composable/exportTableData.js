import {utils, writeFile, writeFileXLSX} from 'xlsx';

export function useExportTableData(tableColumns) {
    const headerRow = [tableColumns.filter(col => col.field !== undefined).map(col => String(col.name).split('"').join('""'))]

    function gatherDataRows(data) {
        return data.map(row => tableColumns.filter(col => col.field !== undefined).map(col => {
            const result = typeof col.field === 'function' ? col.field(row) : row[col.field]
            return result
        }))
    }

    function createWorkbook(data, filename) {
        const dataRows = gatherDataRows(data)

        const workbook = utils.book_new();
        const worksheet = utils.aoa_to_sheet([...headerRow, ...dataRows]);
        utils.book_append_sheet(workbook, worksheet, filename);

        return workbook;
    }

    function exportToCSV(data, filename){
        const workbook = createWorkbook(data, filename);
        writeFile(workbook, filename.concat(".csv"))
    }

    function exportToXLSX(data, filename){
        const workbook = createWorkbook(data, filename);
        writeFileXLSX(workbook, filename.concat(".xlsx"))
    }

    function exportPlateDataToXLSX(data, filename) {

    }

    function exportWellDataToXLSX(data, filename) {

    }

    return {
        exportToCSV,
        exportToXLSX
    }
}
