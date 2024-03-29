import { defineStore } from "pinia"
import projectsGraphQlAPI from "@/api/graphql/projects";
import resultdataGraphQlAPI from "@/api/graphql/resultdata";
import resultDataGraphQlAPI from "@/api/graphql/resultdata";
import curvesGraphQlAPI from "@/api/graphql/curvedata";
import ColorUtils from "@/lib/ColorUtils";

export const useUIStore = defineStore("ui", {
    state: () => ({
        // Selection Handling
        showQuickHeatmap: false,
        selectedPlate: null,

        showChartViewer: false,
        chartViews: [],

        showDRCView: false,
        selectedDRCurves: [],

        selectedWells: [],
        selectedSubstances: new Map([])
    }),
    getters: {
        wells: (state) => {
            return state.selectedPlate?.wells ?? []
        },
        measurements: (state) => {
            return state.selectedPlate?.measurements ?? []
        },
        protocols: (state) => {
            return state.selectedPlate?.protocols ?? []
        },
        getChartView: (state) => {
            return (chartId) => state.chartViews.find(cv => cv.id == chartId)
        },
        getSelectedWells: (state) => () => {
            return [...state.selectedWells];
        },
        getSelectedSubstances: (state) => () => {
            return [...state.selectedSubstances.keys()];
        },
    },
    actions: {
        async loadSelectedPlate(plateId) {
            const {onResult, onError} = projectsGraphQlAPI.plateById(plateId)
            onResult(({data}) => {
                this.selectedPlate = data.plate;
                this.selectedPlate["wells"] = data.wells;

                this.loadPlateMeasurements(plateId)
                this.loadPlateCalculations(plateId)
                this.loadPlateProtocols(plateId)
                this.loadPlateCurves(plateId)
            })
        },
        async loadPlateMeasurements(plateId) {
            const {onResult, onError} = projectsGraphQlAPI.measurementsByPlateId(plateId)
            onResult(({data}) => {
                this.selectedPlate["measurements"] = data.plateMeasurements;
            })
        },
        async loadPlateCalculations(plateId) {
            const {onResult, onError} = resultdataGraphQlAPI.resultSetsByPlateId(plateId)
            onResult(({data}) => {
                this.selectedPlate["resultSets"] = data.resultSets;
            })
        },
        async loadPlateProtocols(plateId) {
            const {onResult, onError} = resultDataGraphQlAPI.protocolsByPlateId(plateId)
            onResult(({data}) => {
                this.selectedPlate["protocols"] = data.protocols;
            })
        },
        async loadPlateCurves(plateId) {
            const {onResult, onError} = curvesGraphQlAPI.curvesByPlateId(plateId)
            onResult(({data}) => {
                const colorList = ColorUtils.getColorList(data.curves?.length)
                const curves = data.curves?.map((curve, index) => {
                    curve['color'] = colorList[index]
                    return curve
                })
                this.selectedPlate["curves"] = curves;
            })
        },
        addDRCure(curve, event) {
            if (event && (event.ctrlKey || event.metaKey)) {
                const index = this.selectedDRCurves.findIndex(c => c.id === curve.id)
                index < 0 ? this.selectedDRCurves.push(curve) : this.selectedDRCurves.splice(index, 1)
                this.selectedDRCurves = [...this.selectedDRCurves]
            } else {
                this.selectedDRCurves = [curve]
            }
        },
        addChartView (chart) {
            this.chartViews.push({id: (new Date()).getTime(), ...chart})
            this.showChartViewer = true
        },
        removeChartView (chartId) {
            this.chartViews = this.chartViews.filter(chartView => chartView.id !== chartId)
            this.chartViews.length > 0 ? this.showChartViewer = true : this.showChartViewer = false
        }
    }
})
