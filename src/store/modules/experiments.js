import experimentAPI from '@/api/experiments.js'
import metadataAPI from '@/api/metadata.js'

const state = () => ({
    experiments: [],
    recentExperiments: []
})

const getters = {
    getByProjectId: (state) => (id) => {
        return state.experiments.filter(exp => exp.projectId === id);
    },
    getById: (state) => (id) => {
        return state.experiments.find(exp => exp.id === id)
    },
    isLoaded: (state) => (id) => {
        return state.experiments.find(exp => exp.id === id)
    },
    getRecentExperiments: (state) => () => {
        return state.recentExperiments
    },
    getNrOfExperiments: (state) => (projectId) => {
        return state.experiments.filter(exp => exp.projectId === projectId).length;
    },
    getNrOfOpenExperiments: (state) => (projectId) => {
        return state.experiments.filter(exp => exp.projectId === projectId).filter(exp => exp.status === 'OPEN').length;
    },
    getNrOfClosedExperiments: (state) => (projectId) => {
        return state.experiments.filter(exp => exp.projectId === projectId).filter(exp => exp.status === 'CLOSED').length;
    }
}

const actions = {
    async loadByProjectId(ctx, id) {
        await experimentAPI.loadByProjectId(id)
            .then(response => {
                ctx.commit('cacheExperiments', response)
            })
    },
    async loadById(ctx, id) {
        await experimentAPI.loadById(id)
            .then(response => {
                ctx.commit('cacheExperiment', response)
            })
    },
    async loadExperimentTags(ctx, experimentId) {
        const tags = await metadataAPI.getObjectTags('EXPERIMENT', experimentId)
        ctx.commit('addTags', tags)
    },
    async createNewExperiment(ctx, newExperiment) {
        const createdExperiment = await experimentAPI.createExperiment(newExperiment);
        ctx.commit('cacheExperiment', createdExperiment)
        return createdExperiment
    },
    async tagExperiment(ctx, tagInfo) {
        await metadataAPI.addObjectTag(tagInfo);
        ctx.commit('addTag', tagInfo);
    },
    async removeTag(ctx, experimentTag) {
        await metadataAPI.removeObjectTag(experimentTag);
        ctx.commit('removeTag', experimentTag);
    },
    async loadRecentExperiments(ctx) {
        await experimentAPI.loadRecentExperiments()
            .then(response => {
                ctx.commit('cacheRecentExperiments', response)
            })
    },
    async deleteExperiment(ctx, id) {
        await experimentAPI.deleteExperiment(id)
            .then(() => {
                ctx.commit('deleteExperiment', id)
            })
    },
    async editExperiment(ctx, experiment) {
        await experimentAPI.editExperiment(experiment)
            .then(() => {
                ctx.commit('deleteExperiment', experiment.id)
                ctx.commit('cacheExperiment', experiment)
            })
    }

}

const mutations = {
    cacheExperiment(state, experiment) {
        if (!containsExperiment(state, experiment)) state.experiments.push(experiment)
    },
    cacheExperiments(state, experiments) {
        experiments.forEach(exp => {
            if (!containsExperiment(state, exp)) state.experiments.push(exp)
        });
    },
    cacheRecentExperiments(state, recentExperiments) {
        state.recentExperiments = recentExperiments
    },
    deleteExperiment(state, id) {
        state.experiments = state.experiments.filter(exp => exp.id !== id)
    },
    addTags(state, tags) {
        for (let i = 0; i < tags.length; i++) {
            var experiment = state.experiments.find(exp => exp.id === tags[i].objectId);
            if (!containsTagInfo(experiment, tags[i]))
                experiment.tags !== undefined ? experiment.tags.push(tags[i]) : experiment.tags = [tags[i]];
        }
    },
    addTag(state, tagInfo) {
        var experiment = state.experiments.find(exp => exp.id === tagInfo.objectId);
        if (!containsTagInfo(experiment, tagInfo))
            experiment.tags !== undefined ? experiment.tags.push(tagInfo) : experiment.tags = [tagInfo];
    },
    removeTag(state, tagInfo) {
        var experiment = state.experiments.find(experiment => experiment.id === tagInfo.objectId)
        if (containsTagInfo(experiment, tagInfo)) {
            var i = experiment.tags.findIndex(t => t.tag === tagInfo.tag);
            experiment.tags.splice(i, 1);
        }
    }
}

function containsExperiment(state, experiment) {
    for (var i = 0; i < state.experiments.length; i++) {
        if (state.experiments[i].id === experiment.id) {
            return true;
        }
    }
    return false;
}

function containsTagInfo(experiment, tagInfo) {
    return experiment.tags !== undefined && experiment.tags.findIndex(t => t.tag === tagInfo.tag) > -1;
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
