import plateAPI from '@/api/plates.js'

const state = () => ({
    currentPlate: {},
    plates: []
})

const getters = {
    getByExperimentId: (state) => (experimentId) => {
        return state.plates.filter(p => p.experimentId === experimentId);
    },
    getById: (state) => (id) => {
        return state.plates.find(plate => plate.id === id);
    },
    getByIds: (state) => (ids) => {
        return state.plates.filter(plate => ids && ids.includes(plate.id));
    },
    isLoaded: (state) => (id) => {
        return state.plates.find(plate => plate.id === id) != null;
    },
    getCurrentPlate: (state) => () => {
        return state.currentPlate;
    },
    getAllPlates: (state) => () => {
        return state.plates
    },
}

const actions = {
    async loadById(ctx, plateId) {
        const plate = await plateAPI.getPlateById(plateId);
        ctx.commit('cacheCurrentPlate', plate);
        ctx.commit('cachePlates', [plate]);
        ctx.dispatch('metadata/loadMetadata', { objectId: plateId, objectClass: 'PLATE' }, {root:true});
    },
    async loadByIds(ctx, plateIds) {
        let plates = [];
        (plateIds || []).forEach(async id => {
            const plate = await plateAPI.getPlateById(id);
            plates.push(plate);
        });
        ctx.commit('cachePlates', plates);
    },
    async loadByExperimentId(ctx, id) {
        if (!ctx.rootGetters['experiments/isLoaded'](id)) {
            ctx.dispatch('experiments/loadById', id, {root:true});
        }

        const plates = await plateAPI.getPlatesByExperimentId(id);
        plates.sort((p1, p2) => p1.barcode.localeCompare(p2.barcode));
        ctx.commit('cachePlates', plates);

        const plateIds = plates.map(plate => plate.id);
        ctx.dispatch('metadata/loadMetadata', { objectId: plateIds, objectClass: 'PLATE' }, {root:true});
    },
    async createNewPlate(ctx, plate) {
        const newPlate = await plateAPI.addPlate(plate);
        ctx.commit('cachePlates', [newPlate]);
    },
    async deletePlate(ctx, id) {
        await plateAPI.deletePlateById(id);
        ctx.commit('deletePlate', id);
    },
    async editPlate(ctx, plate) {
        await plateAPI.editPlate(plate);
        ctx.commit('editPlate', plate);
    },
    async applyPlateLayout(ctx, plate) {
        const edited = await plateAPI.linkPlate(plate.id, plate.linkTemplateId);
        ctx.commit('editPlate', edited);
    },
}

const mutations = {
    cacheCurrentPlate(state, plate) {
        if (state.currentPlate && state.currentPlate.id !== plate.id) {
            state.currentPlate = plate;
        }
    },
    cachePlates(state, plates) {
        plates?.forEach(plate => {
            let i = state.plates.findIndex(p => p.id === plate?.id);
            if (i >= 0) state.plates.splice(i, 1);
            state.plates.push(plate);
        });
    },
    deletePlate(state, id) {
        const experimentId = state.currentPlate.experimentId
        state.plates = state.plates.filter(plate => plate.id !== id)
    },
    editPlate(state, pl) {
        //Replace properties in state.plates
        let i = state.plates.findIndex(t => t.id === pl.id);
        if (i>-1) {
            for (const property in pl) {
                state.plates[i][property] = pl[property]
            }
        }
        //Replace properties in state.currentPlate
        if (Object.keys(state.currentPlate).length>0) {
            for (const property in pl) {
                state.currentPlate[property] = pl[property]
            }
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
