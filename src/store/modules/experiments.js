import experimentAPI from '@/api/experiments.js'

const state = () => ({
    currentExperiment: {},
    experiments: [],
    recentExperiments: [],
    recentExperimentSummaries: []
})

const getters = {
    getByProjectId: (state) => (id) => {
        return state.experiments.filter(exp => exp.projectId === id);
    },
    getById: (state) => (id) => {
        return state.experiments.find(exp => exp.id === id)
    },
    getCurrentExperiment: (state) => () => {
        return state.currentExperiment;
    },
    isLoaded: (state) => (id) => {
        return state.experiments.find(exp => exp.id === id)
    },
    getRecentExperiments: (state) => () => {
        return state.recentExperiments
    },
    getRecentExperimentSummaries: (state) => () => {
        return state.recentExperimentSummaries
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
        const experiments = await experimentAPI.loadByProjectId(id);

        // Load and attach experiment summaries
        const summaries = await experimentAPI.loadExperimentSummariesByProjectId(id);
        for (const exp of experiments) {
            exp.summary = summaries.find(s => s.experimentId === exp.id) || {};
        }

        const experimentIds = experiments.map(exp => exp.id);
        ctx.dispatch('metadata/loadMetadata', { objectId: experimentIds, objectClass: 'EXPERIMENT' }, {root:true});

        ctx.commit('cacheExperiments', experiments);
    },
    async loadById(ctx, experimentId) {
        let experiment = ctx.getters.getById(experimentId);
        if (experiment) {
            ctx.commit('loadExperiment', experiment);
        } else {
            try {
                experiment = await experimentAPI.loadById(experimentId);
                ctx.commit('loadExperiment', experiment);
            } catch (err) {
                console.error(err);
            }
        }

        ctx.dispatch('metadata/loadMetadata', { objectId: experimentId, objectClass: 'EXPERIMENT' }, {root:true});
    },
    async createNewExperiment(ctx, newExperiment) {
        const createdExperiment = await experimentAPI.createExperiment(newExperiment);
        ctx.commit('cacheExperiments', [createdExperiment])
        return createdExperiment
    },
    async loadRecentExperiments(ctx,n) {
        await experimentAPI.loadRecentExperiments()
            .then(response => {
                const list = response.sort((p1, p2) => {
                    let p1Time = new Date((p1.updatedOn)?p1.updatedOn:p1.createdOn).getTime()
                    let p2Time = new Date((p2.updatedOn)?p2.updatedOn:p2.createdOn).getTime()
                    //Fix sort not stopped when reached 0
                    if(!isFinite(p1Time)&&!isFinite(p2Time)) return 0
                    if(!isFinite(p1Time)) return 1
                    if(!isFinite(p2Time)) return -1
                    return  p2Time - p1Time;
                }).slice(0,n)
                //Get all unique project ids
                const unique = [...new Set(list.map(item => item.projectId))]
                unique.forEach(id => {
                    //For each projectId, load experimentSummaries and add them to recent experiments.
                    experimentAPI.loadExperimentSummariesByProjectId(id).then(summaries => {
                        ctx.commit('cacheRecentExperimentSummaries',summaries)
                    });
                })
                ctx.commit('cacheRecentExperiments', list)
            })
    },
    async deleteExperiment(ctx, id) {
        await experimentAPI.deleteExperiment(id);
        ctx.commit('deleteExperiment', id)
    },
    async editExperiment(ctx, experiment) {
        await experimentAPI.editExperiment(experiment);
        ctx.commit('deleteExperiment',experiment.id);
        ctx.dispatch('loadById', experiment.id);
    }
}

const mutations = {
    loadExperiment(state, experiment) {
        state.currentExperiment = experiment;
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
    cacheRecentExperimentSummaries(state, summaries) {
        summaries.forEach(sum => {
            if (!containsSummary(state, sum)) state.recentExperimentSummaries.push(sum)
        })
    }
}

function containsExperiment(state, experiment) {
    for (let i = 0; i < state.experiments.length; i++) {
        if (state.experiments[i].id === experiment.id) {
            return true;
        }
    }
    return false;
}

function containsSummary(state, summary) {
    for (let i = 0; i < state.recentExperimentSummaries.length; i++) {
        if (state.recentExperimentSummaries[i].experimentId === summary.experimentId) {
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
