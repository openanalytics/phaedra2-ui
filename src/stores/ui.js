import { defineStore } from "pinia"
import templateAPI from  "@/api/templates.js"

export const useUIStore = defineStore("ui", {
    state: () => ({
        // Selection Handling
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
    }
})
