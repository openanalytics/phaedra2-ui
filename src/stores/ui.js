import { defineStore } from "pinia"
import projectsGraphQlAPI from "@/api/graphql/projects";

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
        getChartView: (state) => {
            return (chartId) => state.chartViews.find(cv => cv.id == chartId)
        }
    },
    actions: {
        loadSelectedPlate(plateId) {
            const {onResult, onError} = projectsGraphQlAPI.plateById(plateId)
            onResult(({data}) => {
                this.plate = data.plate;
            })
        },
        getSelectedWells: (state) => () => {
            return [...state.selectedWells];
        },
        getSelectedSubstances: (state) => () => {
            return [...state.selectedSubstances.keys()];
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
            this.chartViews.push({id: this.chartViews.length, ...chart})
            this.showChartViewer = true
        },
        removeChartView (chartId) {
            const index = this.chartViews.findIndex((chartView) => chartView.id === chartId)
            if (index > -1) {
                this.chartViews.splice(index, 1)
            }
            this.chartViews.length > 0 ? this.showChartViewer = true : this.showChartViewer = false
        }
    }
})
