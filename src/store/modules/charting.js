import chartsGraphQlAPI from '@/api/graphql/charts'

const state = () => ({
    mockChartEntity: [{id: 8795, plateId: 101, row: 1, column: 1, wellType: 'LC', featureName: 0.232, featurename2: 0.324}, //+ wellnumber
        {id: 8796, plateId: 101, row: 1, column: 2, wellType: 'LC', featureName: 0.484, featurename2: 0.87},
        {id: 8797, plateId: 101, row: 1, column: 3, wellType: 'LC', featureName: 0.567, featurename2: 0.23},
        {id: 8798, plateId: 101, row: 1, column: 4, wellType: 'LC', featureName: 0.234, featurename2: 0.45},
        {id: 8799, plateId: 101, row: 1, column: 5, wellType: 'LC', featureName: 0.76, featurename2: 0.67},
        {id: 8800, plateId: 101, row: 1, column: 6, wellType: 'LC', featureName: 0.321, featurename2: 0.89},
        {id: 8801, plateId: 101, row: 1, column: 7, wellType: 'HC', featureName: 0.123, featurename2: 0.12},
        {id: 8802, plateId: 101, row: 1, column: 8, wellType: 'HC', featureName: 0.456, featurename2: 0.34},
        {id: 8803, plateId: 101, row: 1, column: 9, wellType: 'HC', featureName: 0.789, featurename2: 0.56},
        {id: 8804, plateId: 101, row: 1, column: 10, wellType: 'HC', featureName: 0.987, featurename2: 0.78},
        {id: 8805, plateId: 101, row: 1, column: 11, wellType: 'HC', featureName: 0.654, featurename2: 0.90},
        {id: 8806, plateId: 101, row: 1, column: 12, wellType: 'HC', featureName: 0.543, featurename2: 0.654},],

    mockChartTemplateScatter: {
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
        grouperExpression: 'wellType',
        grouperValues: ['LC', 'HC'],
        chartSettings: {
            pointSize: 10,
            pointColor: 'blue',
        }
    },
    mockChartTemplateBox: {
        type: 'boxplot',
        axisXExpression: 'row',
        axisYExpression: 'featurename2',
        axisSettings: {
            x: {
                range: [0, 1],
            },
            y: {
                range: [0, 1],
            },
        },
        grouperExpression: 'wellType',
        chartSettings: {
            pointSize: 20,
            pointColor: 'blue',
        }
    },
    mockChartTemplateBar: {
        type: 'barplot',
        axisXExpression: 'row',
        axisYExpression: 'featurename2',
        axisSettings: {
            x: {
                range: [0, 1],
            },
            y: {
                range: [0, 1],
            },
        },
        grouperExpression: 'wellType',
        chartSettings: {
            pointSize: 20,
            pointColor: 'blue',
        }
    },
    mockChartTemplateLine: {
        type: 'lineplot',
        axisXExpression: 'row',
        axisYExpression: 'featurename2',
        axisSettings: {
            x: {
                range: [0, 1],
            },
            y: {
                range: [0, 1],
            },
        },
        grouperExpression: 'wellType',
        chartSettings: {
            pointSize: 20,
            pointColor: 'blue',
        }
    }
})

const getters = {
    getChartEntity: (state) => (wellIds) => {
        if (wellIds.length == 0) return state.mockChartEntity
        return state.mockChartEntity.filter(el => wellIds.includes(el.id))
    },
    getChartTemplate: (state) => (type) => {
        if (type == 'scatter2D') return state.mockChartTemplateScatter;
        if (type == 'boxplot') return state.mockChartTemplateBox;
        if (type == 'barplot') return state.mockChartTemplateBar;
        if (type == 'lineplot') return state.mockChartTemplateLine;
    },
}

const actions = {
    scatterPlot: (ctx, inputVariables) => {
        const scatterPlot = chartsGraphQlAPI.scatterPlot(inputVariables)

    }
}

export default {
    namespaced: true,
    state,
    getters,
}
