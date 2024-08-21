import {utils, writeFile, writeFileXLSX} from 'xlsx';

export default {
  exportPlateDataToXLSX(data, filename) {
    const workbook = createWorkbook()
    const worksheet = utils.json_to_sheet(data);
    utils.book_append_sheet(workbook, worksheet, filename);
    writeFileXLSX(workbook, filename.concat(".xlsx"))
  },
  exportWellDataToXLSX(data, filename) {
    const workbook = createWorkbook()
    const header1 = ["Plate ID", "Barcode", "Experiment ID", "Experiment Name", "Comment", "Plate Template ID", "Validation Status", "Approval Status", "Features"]
    const header2 = ["Plate ID", "Barcode", "Experiment ID", "Experiment Name", "Comment", "Plate Template ID", "Validation Status", "Approval Status", "Features"]
    const worksheet = utils.json_to_sheet([header1, data]);
    utils.book_append_sheet(workbook, worksheet, filename);
    writeFileXLSX(workbook, filename.concat(".xlsx"))
  }
}

const createWorkbook = () => {
  const workbook = utils.book_new();
  return workbook;
}

