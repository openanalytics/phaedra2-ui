import { defineStore } from "pinia"
import curvedataAPI from "@/api/curvedata.js"

export const useCurveDataStore = defineStore("curvedata", {
    state: () => ({
        curvedata: {}
    }),
    actions: {
        async loadPlateCurves(plateId) {
            this.curvedata[plateId] = await curvedataAPI.getCurvesByPlateId(plateId)
        },
        getCurvesByPlateId(plateId) {
            return this.curvedata[plateId];
        },
        getCurvesSubstanceNames(plateId) {
            return this.curvedata[plateId].map(cd => cd.substanceName )
        }
    }
})
