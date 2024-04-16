const getWellTypeColor = (wellType) => {
    switch (wellType) {
      case "SAMPLE": return "#5050C8";
      case "NC": return "#C80000";
      case "PC": return "#00C800";
      case "LC": return "#C80000";
      case "HC": return "#00C800";
      default: return "#969696";
    }
}

const getWellCoordinate = (row, column) => {
    return getWellRowLabel(row) + (column < 10 ? '0' + column : column);
}

const getWellRowLabel = (row) => {
    let rowLabel = String.fromCharCode(64 + row);
    if (row > 26) {
        // After row Z, start with AA
        let div = row / 26;
        let mod = row % 26;
        rowLabel = String.fromCharCode(64 + div) + String.fromCharCode(64 + mod);
    }
    return rowLabel;
}

const getWellNr = (row, column, colCount) => {
    return ((row-1) * colCount) + column;
}

const getWellPosition = (wellNr, columnCount) => {
    wellNr--;
    let rowNr = 1 + Math.floor(wellNr / columnCount);
    let colNr = 1 + wellNr % columnCount;
    return [ rowNr, colNr ];
}

const getWell = (wells, row, column) => {
    return wells.find(w => w.row === row && w.column === column)
}

const getWellPositions = (rows, columns) => {
    const positions = [];

    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= columns; j++) {
            positions.push(getWellCoordinate(i, j));
        }
    }
    return positions;
}

const getWellNrByWellPos = (wellPos, columnCount) => {
    const regex = /^([A-Z]+)(\d+)$/;

    const matches = wellPos?.match(regex);
    if (matches) {
        const rowPart = matches[1];
        let rowNr = 0;

        if (rowPart.length === 1) {
            // Single letter row label (A-Z)
            rowNr = rowPart.charCodeAt(0) - 64;
        } else if (rowPart.length === 2) {
            // Double letter row label (AA-ZZ)
            let div = rowPart.charCodeAt(0) - 64;
            let mod = rowPart.charCodeAt(1) - 64;
            rowNr = (div * 26) + mod;
        }

        const columnNr = parseInt(matches[2], 10);

        return  ((rowNr-1) * columnCount) + columnNr;
    } else {
        return -1;
    }
}

const isRejected = (well)  => /REJECTED.*/.test(well.status);


export default {
    getWellTypeColor,
    getWellCoordinate,
    getWellRowLabel,
    getWellNr,
    getWellPosition,
    getWell,
    getWellPositions,
    getWellNrByWellPos,
    isRejected
}
