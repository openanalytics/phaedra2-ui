const getPlateDimensions = (targetWells) => {
    const arrangements = [
        { rows: 2, cols: 3, wells: 6 },
        { rows: 3, cols: 4, wells: 12 },
        { rows: 4, cols: 6, wells: 24 },
        { rows: 6, cols: 8, wells: 48 },
        { rows: 8, cols: 12, wells: 96 },
        { rows: 16, cols: 24, wells: 384 },
        { rows: 32, cols: 48, wells: 1536 },
        { rows: 48, cols: 72, wells: 3456 }
        // Add more microplate arrangements as needed
    ];

    let bestArrangement = null;

    for (const arrangement of arrangements) {
        if (targetWells <= arrangement.wells) {
            bestArrangement = arrangement;
            break
        }
    }

    return bestArrangement;
}

export default {
    getPlateDimensions
}
