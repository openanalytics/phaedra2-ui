// import experimentAPI from '@/api/experiments.js'
import axios from "axios";

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
        await axios.get('http://localhost:6010/phaedra/plate-service/project/' + id + '/experiments')
            .then(response => {
                ctx.commit('cacheExperiments', response.data)
            })
    },
    async loadById(ctx, id) {
        await axios.get('http://localhost:6010/phaedra/plate-service/experiment/' + id)
            .then(response => {
                ctx.commit('cacheExperiment', response.data)
            })
    },
    async loadExperimentTags(ctx, experimentId) {
        await axios.get('http://localhost:6020/phaedra/metadata-service/tagged_objects/EXPERIMENT',
            {params: {objectId: experimentId}})
            .then(response => {
                ctx.commit('addTags', response.data)
            })
    },
    async createNewExperiment(ctx, newExperiment) {
        const response = await axios.post('http://localhost:6010/phaedra/plate-service/experiment', newExperiment)
        const createdExperiment = response.data
        ctx.commit('cacheExperiment', createdExperiment)
        return createdExperiment
    },
    tagExperiment(ctx, tagInfo) {
        axios.post('http://localhost:6020/phaedra/metadata-service/tags', tagInfo)
            .then(response => {
                if (response.status === 201) {
                    ctx.commit('addTag', tagInfo);
                }
                console.log(response)
            })
    },
    removeTag(ctx, projectTag) {
        axios.delete('http://localhost:6020/phaedra/metadata-service/tags', {data: projectTag})
            .then(response => {
                if (response.status === 200) {
                    ctx.commit('removeTag', projectTag);
                }
                console.log(response)
            })
    },
    async loadRecentExperiments(ctx) {
        await axios.get('http://localhost:6010/phaedra/plate-service/experiment')
            .then(response => {
                ctx.commit('cacheRecentExperiments', response.data)
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
    addTags(state, tags) {
        for (let i = 0; i < tags.length; i++) {
            var experiment = state.experiments.find(exp => exp.id === tags[i].objectId);
            if (!containsTagInfo(experiment, tags[i]))
                experiment.tags !== undefined ? experiment.tags.push(tags[i]) : experiment.tags = [ tags[i] ];
        }
    },
    addTag(state, tagInfo) {
        var experiment = state.experiments.find(exp => exp.id === tagInfo.objectId);
        if (!containsTagInfo(experiment, tagInfo))
            experiment.tags !== undefined ? experiment.tags.push(tagInfo) : experiment.tags = [ tagInfo ];
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
    for (var i = 0; i < state.experiments.length; i++){
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
