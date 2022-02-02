import metadataAPI from '@/api/metadata.js'

const state = () => ({
    tags: {},
    properties: {}
})

const getters = {
    getTags: (state) => (objectDescriptor) => {
        const key = getKey(objectDescriptor);
        return state.tags[key];
    },
    getProperties: (state) => (objectDescriptor) => {
        const key = getKey(objectDescriptor);
        return state.properties[key];
    },
    areTagsLoaded: (state) => (objectDescriptor) => {
        const key = getKey(objectDescriptor);
        return (typeof state.tags[key] !== 'undefined');
    },
    arePropertiesLoaded: (state) => (objectDescriptor) => {
        const key = getKey(objectDescriptor);
        return (typeof state.properties[key] !== 'undefined');
    }
}

const actions = {
    async addTag(ctx, tagDescriptor) {
        const isAdded = await metadataAPI.addTag(tagDescriptor);
        if (isAdded) ctx.commit('cacheTag', tagDescriptor);
    },
    async removeTag(ctx, tagDescriptor) {
        const isRemoved = await metadataAPI.removeTag(tagDescriptor);
        if (isRemoved) ctx.commit('uncacheTag', tagDescriptor);
    },
    async loadTags(ctx, args) {
        if (!args.objectId) return;
        const tags = await metadataAPI.getObjectTags(args.objectId, args.objectClass);
        if (tags) ctx.commit('cacheTags', { objectId: args.objectId, objectClass: args.objectClass, tags: tags });
    },
    async addProperty(ctx, propertyDescriptor) {
        const isAdded = await metadataAPI.addProperty(propertyDescriptor);
        if (isAdded) ctx.commit('cacheProperty', propertyDescriptor);
    },
    async removeProperty(ctx, propertyDescriptor) {
        const isRemoved = await metadataAPI.removeProperty(propertyDescriptor);
        if (isRemoved) ctx.commit('uncacheProperty', propertyDescriptor);
    },
    async loadProperties(ctx, args) {
        if (!args.objectId) return;
        const properties = await metadataAPI.getObjectProperties(args.objectId, args.objectClass);
        if (properties) ctx.commit('cacheProperties', { objectId: args.objectId, objectClass: args.objectClass, properties: properties });
    },
    async loadMetadata(ctx, objectDescriptor) {
        if (!objectDescriptor.objectId || objectDescriptor.objectId.length == 0) return;

        const metadata = await metadataAPI.getMetadata(objectDescriptor.objectId, objectDescriptor.objectClass);
        for (const row of metadata) {
            if (row.tags) ctx.commit('cacheTags', { objectId: row.objectId, objectClass: row.objectClass, tags: row.tags });
            if (row.properties) ctx.commit('cacheProperties', { objectId: row.objectId, objectClass: row.objectClass, properties: row.properties });
        }
    },
}

const mutations = {
    cacheTag(state, tagDescriptor) {
        const key = getKey(tagDescriptor);
        if (!state.tags[key]) state.tags[key] = [];
        addTag(state.tags[key], tagDescriptor);
    },
    cacheTags(state, tagsDescriptor) {
        const key = getKey(tagsDescriptor);
        if (!state.tags[key]) state.tags[key] = [];
        for (const tagDescriptor of tagsDescriptor.tags) {
            addTag(state.tags[key], tagDescriptor);
        }
    },
    uncacheTag(state, tagDescriptor) { 
        const key = getKey(tagDescriptor);
        if (state.tags[key]) removeTag(state.tags[key], tagDescriptor);
    },
    cacheProperty(state, propertyDescriptor) {
        const key = getKey(propertyDescriptor);
        if (!state.properties[key]) state.properties[key] = [];
        addProperty(state.properties[key], propertyDescriptor);
    },
    cacheProperties(state, propertiesDescriptor) {
        const key = getKey(propertiesDescriptor);
        if (!state.properties[key]) state.properties[key] = [];
        for (const propertyDescriptor of propertiesDescriptor.properties) {
            addProperty(state.properties[key], propertyDescriptor);
        }
    },
    uncacheProperty(state, propertyDescriptor) {
        const key = getKey(propertyDescriptor);
        if (state.properties[key]) removeProperty(state.properties[key], propertyDescriptor);
    },
}

/* Private helper functions */

function getKey(object) {
    if (object) return object.objectClass + '-' + object.objectId;
    return undefined;
}

function addTag(array, element) {
    const index = array.findIndex(el => el.tag === element.tag);
    if (index == -1) array.push(element);
}

function removeTag(array, element) {
    const index = array.findIndex(el => el.tag === element.tag);
    if (index != -1) array.splice(index, 1);
}

function addProperty(array, element) {
    const index = array.findIndex(el => el.propertyName === element.propertyName);
    if (index == -1) array.push(element);
    else array[index].propertyValue = element.propertyValue;
}

function removeProperty(array, element) {
    const index = array.findIndex(el => el.propertyName === element.propertyName);
    if (index != -1) array.splice(index, 1);
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}