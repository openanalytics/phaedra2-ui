import { defineStore } from "pinia"
import templateAPI from  "@/api/templates.js"

export const useUIStore = defineStore("ui", {
    state: () => ({
        // Selection Handling
        showQuickHeatmap: false,
        selectedPlate: null,

        showDRCView: false,
        selectedDRCurves: [],

        selectedWells: [],
        selectedSubstances: new Map([])
    }),
    actions: {
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
        }
    }
})
