import curvedataAPI from "@/api/curvedata.js"
import ColorUtils from "@/lib/ColorUtils";

const state = () => ({
    curvedata: {}
})

const getters = {
    getCurvesByPlateId: (state) => (plateId) => {
        return state.curvedata[plateId];
    },
    getCurvesSubstanceNames: (state) => (plateId) => {
        return state.curvedata[plateId].map(cd => cd.substanceName)
    },
    getCurvesByPlateIdAndSubstances: (state) => (plateId, substances) => {
        if (plateId !== null && substances.length > 0)
            return state.curvedata[plateId].filter(cd => substances.includes(cd.substanceName))
        else
            return null
    }
}

const actions = {
    async loadPlateCurves(ctx, plateIds) {
        if (Array.isArray(plateIds))
            for (let i = 0; i < plateIds.length; i++) {
                const curvedata = await curvedataAPI.getLatestCurvesByPlateId(plateIds[i]);
                ctx.commit('cacheCurvedata', plateIds[i], curvedata)
            }
        else {
            const curvedata = await curvedataAPI.getLatestCurvesByPlateId(plateIds);
            const colorList = ColorUtils.getColorList(curvedata.length)
            for (let i = 0; i < curvedata.length; i++) {
                curvedata[i]["color"] = colorList[i]
            }
            const data = [plateIds, curvedata]
            ctx.commit('cacheCurvedata', data)
        }
    }
}

const mutations = {
    cacheCurvedata(state, data) {
        state.curvedata[data[0]] = data[1]
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
