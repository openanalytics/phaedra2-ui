import { defineStore } from "pinia"
import curvedataAPI from "@/api/curvedata.js"
import ColorUtils from "@/lib/ColorUtils";

export const useCurveDataStore = defineStore("curvedata", {
    state: () => ({
        curvedata: {}
    }),
    actions: {
        async loadPlateCurves(plateIds) {
            if (Array.isArray(plateIds))
                for (let i = 0; i < plateIds.length; i++) {
                    this.curvedata[plateIds[i]] = await curvedataAPI.getCurvesByPlateId(plateIds[i])
                }
            else {
                this.curvedata[plateIds] = await curvedataAPI.getCurvesByPlateId(plateIds)
                for (let i = 0; i < this.curvedata[plateIds].length; i++) {
                    this.curvedata[plateIds][i]["color"] = ColorUtils.generateRGBColor()
                }
            }
        },
        getCurvesByPlateId(plateId) {
            return this.curvedata[plateId];
        },
        getCurvesSubstanceNames(plateId) {
            return this.curvedata[plateId].map(cd => cd.substanceName)
        },
        getCurvesByPlateIdAndSubstances(plateId, substances) {
            if (plateId && substances)
                return this.curvedata[plateId].filter(cd => substances.includes(cd.substanceName))
            else
                return null
        }
    }
})
