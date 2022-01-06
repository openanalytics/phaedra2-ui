import experimentAPI from '@/api/experiments.js'
import metadataAPI from '@/api/metadata.js'

const state = () => ({
    currentExperiment: {},
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
    getCurrentExperiment: (state) => () => {
        return state.currentExperiment;
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
        const experiments = await experimentAPI.loadByProjectId(id);
        const summaries = await experimentAPI.loadExperimentSummariesByProjectId(id);

        // Load and attach experiment summaries
        for (const exp of experiments) {
            exp.summary = summaries.find(s => s.experimentId == exp.id) || {};
        }

        ctx.commit('cacheExperiments', experiments);
    },
    async loadById(ctx, experimentId) {
        // Load experiment by id
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

        // Load experiment properties
        if (experiment && !experiment.properties) {
            metadataAPI.getObjectProperties(experimentId, 'EXPERIMENT')
                .then(result => {
                    console.log('Load experiment properties');
                    ctx.commit('loadProperties', result);
                })
        }

        // Load experiment tags
        if (experiment && !experiment.tags) {
            metadataAPI.getObjectTags(experimentId, 'EXPERIMENT')
                .then(result => {
                    console.log('Load experiment tags');
                    ctx.commit('loadTags', result);
                })
        }
    },
    async createNewExperiment(ctx, newExperiment) {
        const createdExperiment = await experimentAPI.createExperiment(newExperiment);
        ctx.commit('cacheExperiments', [createdExperiment])
        return createdExperiment
    },
    async tagExperiment(ctx, tag) {
        await metadataAPI.addTag(tag)
            .then(isAdded => {
                isAdded ? ctx.commit('addTag', tag) : console.log("TODO: Show error message");
            });
    },
    async removeTag(ctx, tag) {
        await metadataAPI.removeTag(tag)
            .then(isDeleted => {
                isDeleted ? ctx.commit('removeTag', tag) : console.log("TODO: Show error message");
            })
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
                list.forEach(experiment => {console.log(experiment.id);ctx.dispatch('plates/loadByExperimentId', experiment.id, { root: true })})
                ctx.commit('cacheRecentExperiments', list)
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
            .then(() =>{
                ctx.commit('deleteExperiment',experiment.id)
                ctx.commit('loadExperiment',experiment)
            })
    },
    async addProperty(ctx, property) {
        await metadataAPI.addProperty(property)
            .then(isAdded => {
                isAdded ? ctx.commit('addProperty', property) : console.log("TODO: Show error message");
            });
    },
    async removeProperty(ctx, property) {
        await metadataAPI.removeProperty(property)
            .then(isDeleted => {
                isDeleted ? ctx.commit('removeProperty', property) : console.log("TODO: Show error message");
            });
    }

}

const mutations = {
    loadExperiment(state, experiment) {
        state.currentExperiment = experiment;
    },
    cacheExperiments(state, experiments) {
        experiments.forEach(exp => {
            if (!containsExperiment(state, exp)) state.experiments.push(exp)
        });
    },
    cacheRecentExperiments(state, recentExperiments) {
        state.recentExperiments = recentExperiments.sort((p1, p2) => {
            let p1Time = new Date((p1.updatedOn)?p1.updatedOn:p1.createdOn).getTime()
            let p2Time = new Date((p2.updatedOn)?p2.updatedOn:p2.createdOn).getTime()
            //Fix sort not stopped when reached 0
            if(!isFinite(p1Time)&&!isFinite(p2Time)) return 0
            if(!isFinite(p1Time)) return 1
            if(!isFinite(p2Time)) return -1
            return  p2Time - p1Time;
        })
        console.log(state.recentExperiments)
    },
    deleteExperiment(state, id) {
        state.experiments = state.experiments.filter(exp => exp.id !== id)
    },
    loadTags(state, tags) {
        for (let i = 0; i < tags.length; i++) {
            if (!containsTag(state.currentExperiment, tags[i]))
                state.currentExperiment.tags !== undefined ? state.currentExperiment.tags.push(tags[i]) : state.currentExperiment.tags = [tags[i]];
        }
    },
    addTag(state, tag) {
        if (!containsTag(state.currentExperiment, tag))
            state.currentExperiment.tags !== undefined ? state.currentExperiment.tags.push(tag) : state.currentExperiment.tags = [tag];
    },
    removeTag(state, tagInfo) {
        if (containsTag(state.currentExperiment, tagInfo)) {
            let i = state.currentExperiment.tags.findIndex(t => t.tag === tagInfo.tag);
            state.currentExperiment.tags.splice(i, 1);
        }
    },
    addProperty(state, propertyInfo) {
        if (!containsPropertyInfo(state.currentExperiment, propertyInfo)) {
            state.currentExperiment.properties !== undefined ? state.currentExperiment.properties.push(propertyInfo) : state.currentExperiment.properties = [propertyInfo];
        }
    },
    loadProperties(state, properties) {
        for (let i = 0; i < properties.length; i++) {
            if (!containsPropertyInfo(state.currentExperiment, properties[i])) {
                state.currentExperiment.properties !== undefined ? state.currentExperiment.properties.push(properties[i]) : state.currentExperiment.properties = [properties[i]];
            }
        }
    },
    removeProperty(state, propertyInfo) {
        if (containsPropertyInfo(state.currentExperiment, propertyInfo)) {
            let i = state.currentExperiment.properties.findIndex(p => p.propertyName === propertyInfo.propertyName);
            state.currentExperiment.properties.splice(i, 1);
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

function containsTag(experiment, tag) {
    return experiment.tags !== undefined
        && experiment.tags.findIndex(t => t.tag === tag.tag) > -1;
}

function containsPropertyInfo(experiment, propertyInfo) {
    return experiment.properties !== undefined
        && experiment.properties.findIndex(p => p.propertyName === propertyInfo.propertyName) > -1;
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
