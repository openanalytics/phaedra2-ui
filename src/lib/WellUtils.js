function getWellTypeColor(wellType) {
    switch (wellType) {
      case "SAMPLE": return "#5050C8";
      case "NC": return "#C80000";
      case "PC": return "#00C800";
      default: return "#969696";
    }
}

function getWellCoordinate(row, column) {
    return String.fromCharCode(64 + row) + column;
}

function getWellNr(row, column, colCount) {
    return ((row-1) * colCount) + column;
}

export default {
    getWellTypeColor,
    getWellCoordinate,
    getWellNr
}