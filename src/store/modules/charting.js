const state = () => ({
    mockChartEntity: [{id: 8795, plateId: 101, row: 1, column: 1, wellType: 'LC', featureName: 0.232, featurename2: 0.324},
        {id: 8796, plateId: 101, row: 1, column: 2, wellType: 'LC'},
        {id: 8797, plateId: 101, row: 1, column: 3, wellType: 'LC'},
        {id: 8798, plateId: 101, row: 1, column: 4, wellType: 'LC'},
        {id: 8799, plateId: 101, row: 1, column: 5, wellType: 'LC'},
        {id: 8800, plateId: 101, row: 1, column: 6, wellType: 'LC'},
        {id: 8801, plateId: 101, row: 1, column: 7, wellType: 'HC'},
        {id: 8802, plateId: 101, row: 1, column: 8, wellType: 'HC'},
        {id: 8803, plateId: 101, row: 1, column: 9, wellType: 'HC'},
        {id: 8804, plateId: 101, row: 1, column: 10, wellType: 'HC'},
        {id: 8805, plateId: 101, row: 1, column: 11, wellType: 'HC'},
        {id: 8806, plateId: 101, row: 1, column: 12, wellType: 'HC'},],

    mockChartTemplate: {
        type: 'scatter',
        axisXExpression: 'row',
        axisYExpression: 'column',
        axisSettings: {
            x: {
                labelPattern: '#.##',
            },
            y: {
                range: [0, 100],
            }
        },
        grouper: 'wellType',
        chartSettings: {
            pointSize: 10,
        }
    }
})

const getters = {
    getChartEntity: (state) => (plateId) => {
        return state.mockChartEntity;
    },
    getChartTemplate: (state) => (type) => {
        return state.mockChartTemplate;
    }
}

export default {
    namespaced: true,
    state,
    getters,
}