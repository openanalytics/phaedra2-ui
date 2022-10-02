import { defineStore } from "pinia"
import platesAPI from "@/api/plates"
import calculationsAPI from "@/api/calculations"

export const usePlateStore = defineStore("plate", {
    state: () => ({
        plate: {}
    }),
    actions: {
        async loadPlate(plate) {
            this.plate = plate;
        },
        async fitDoseResponseCurves(plate) {
            await calculationsAPI.fitDoseResponseCurves()
        }
    }
})
