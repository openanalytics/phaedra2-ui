import { defineStore } from "pinia"
import templateAPI from  "@/api/templates.js"

export const useUIStore = defineStore("ui", {
    state: () => ({
        // Selection Handling
        selectedWells: []
    }),
    actions: {
        getSelectedWells: (state) => () => {
            return [...state.selectedWells];
        }
    }
})
