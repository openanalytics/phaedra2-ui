import experimentAPI from "@/api/experiments"
import plateAPI from '@/api/plates.js'

const state = () => ({
    currentPlate: {},
    plates: [],
    platesInExperiment: {}
})

const getters = {
    getByExperimentId: (state) => (id) => {
        return state.platesInExperiment[id];
    },
    getById: (state) => (id) => {
        return state.plates.find(plate => plate.id === id);
    },
    isLoaded: (state) => (id) => {
        return state.plates.find(plate => plate.id === id) != null;
    },
    isExperimentLoaded: (state) => (experimentId) => {
        return state.platesInExperiment[experimentId] !== undefined;
    },
    getCurrentPlate: (state) => () => {
        return state.currentPlate;
    },
    getAllPlates: (state) => () => {
        return state.plates
    },
    getPlatesInExperiment: (state) => () => {
        return state.platesInExperiment
    },
}

const actions = {
    async loadByExperimentId(ctx, id) {
        if (!ctx.getters['isExperimentLoaded'](id)) {
            const experiment = experimentAPI.getExperimentById(id);
            ctx.commit('experiments/loadExperiment', experiment, {root:true});
            ctx.commit('experiments/cacheExperiments', [experiment], {root:true});
        }
        const plates = await plateAPI.getPlatesByExperimentId(id);
        plates.sort((p1, p2) => p1.barcode.localeCompare(p2.barcode));

        ctx.commit('cachePlates', plates);
        ctx.commit('cachePlatesInExperiment', {experimentId: id, plates});

        const plateIds = plates.map(plate => plate.id);
        ctx.dispatch('metadata/loadMetadata', { objectId: plateIds, objectClass: 'PLATE' }, {root:true});
    },
    async loadById(ctx, plateId) {
        // Load plate by id
        let plate = ctx.getters.getById(plateId);
        if (plate) {
            ctx.commit('loadPlate', plate);
        } else {
            try {
                plate = await plateAPI.getPlateById(plateId);
                console.log('Load plate by id');
                ctx.commit('loadPlate', plate);
            } catch (err) {
                console.error(err);
            }
        }

        // Load plate metadata
        ctx.dispatch('metadata/loadMetadata', { objectId: plateId, objectClass: 'PLATE' }, {root:true});

        // Load plate measurements
        ctx.dispatch('measurements/loadByPlateId', { plateId: plateId }, { root: true })

        // Load the 'calculated' plate results
        ctx.dispatch('resultdata/loadPlateResults', {plateId: plateId}, {root: true});
    },
    async loadByIds(ctx, plateIds) {
      for (let i in plateIds) {
          const plate = await plateAPI.getPlateById(plateIds[i]);
          ctx.commit('cachePlate', plate);
      }
    },
    async createNewPlate(ctx, plate) {
        const newPlate = await plateAPI.addPlate(plate)
        ctx.commit('cacheNewPlate', newPlate)
    },
    async deletePlate(ctx, id) {
        await plateAPI.deletePlateById(id)
            .then(() => {
                ctx.commit('deletePlate', id)
            })
    },
    async editPlate(ctx, plate) {
        await plateAPI.editPlate(plate)
            .then(() => {
                ctx.commit('editPlate', plate)
            })
    },
    async applyPlateLayout(ctx, plate) {
        const edited = await plateAPI.linkPlate(plate.id, plate.linkTemplateId);
        ctx.commit('editPlate', edited);
    },
    async loadPlateForCalculation(ctx, id) {
        await plateAPI.getPlateById(id)
            .then(plate => {
                if (plate) ctx.commit('cacheNewPlate',plate)
            })
    }
}

const mutations = {
    loadPlate(state, plate) {
        if (state.currentPlate && state.currentPlate.id !== plate.id) {
            state.currentPlate = plate;
        }
        if (!state.plates.find(it => it.id === plate.id)) {
            state.plates.push(plate)
        }
    },
    cachePlate(state, plate) {
        if (!state.plates.find(it => it?.id === plate?.id)) {
            state.plates.push(plate)
        }
    },
    cachePlates(state, plates) {
        plates?.forEach(plate => {
            if (!state.plates.find(it => it?.id === plate?.id)) {
                state.plates.push(plate)
            }
        });
    },
    cacheNewPlate(state, plate){
        if(!containsPlate(state,plate)) {
            state.plates.push(plate);
            (state.platesInExperiment[plate.experimentId])?state.platesInExperiment[plate.experimentId].push(plate):state.platesInExperiment[plate.experimentId]=[plate]
        }
    },
    cachePlatesInExperiment(state, args) {
        state.platesInExperiment[args.experimentId] = args.plates;
    },
    deletePlate(state, id) {
        const experimentId = state.currentPlate.experimentId
        state.plates = state.plates.filter(plate => plate.id !== id)
        let i = state.platesInExperiment[experimentId].findIndex(t => t.id === id);
        state.platesInExperiment[experimentId].splice(i, 1);
    },
    editPlate(state, pl) {
        //Replace properties in state.plates
        let i = state.plates.findIndex(t => t.id === pl.id);
        if(i>-1){
            for (const property in pl){
                state.plates[i][property] = pl[property]
            }
        }
        //Replace properties in state.currentPlate
        if(Object.keys(state.currentPlate).length>0){
            for (const property in pl){
                state.currentPlate[property] = pl[property]
            }
        }
        //Replace properties in state.platesInExperiment
        let j = state.platesInExperiment[pl.experimentId]?.findIndex(t => t.id === pl.id);
        if (j>-1) {
            for (const property in pl){
                state.platesInExperiment[pl.experimentId][j][property] = pl[property]
            }
        }
    }
}

function containsPlate(state, plate) {
    for (var i = 0; i < state.plates.length; i++){
        if (state.plates[i]?.id === plate.id) {
            return true;
        }
    }
    return false;
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
