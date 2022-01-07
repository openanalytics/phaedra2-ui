function getWellTypeColor(wellType) {
    switch (wellType) {
      case "SAMPLE": return "#5050C8";
      case "NC": return "#C80000";
      case "PC": return "#00C800";
      case "LC": return "#C80000";
      case "HC": return "#00C800";
      default: return "#969696";
    }
}

function getWellCoordinate(row, column) {
    let rowLabel = String.fromCharCode(64 + row);
    if (row > 26) {
        // After row Z, start with AA
        let div = row / 26;
        let mod = row % 26;
        rowLabel = String.fromCharCode(64 + div) + String.fromCharCode(64 + mod);
    }
    return rowLabel + column;
}

function getWellNr(row, column, colCount) {
    return ((row-1) * colCount) + column;
}

function getWell(plate, row, column) {
    return plate.wells.find(w => w.row == row && w.column == column)
}

export default {
    getWellTypeColor,
    getWellCoordinate,
    getWellNr,
    getWell
}