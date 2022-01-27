import userinfoAPI from '@/api/userinfo.js'

const state = () => ({
    userinfo: {}
})

const getters = {
    getUserInfo: (state) => () => {
        return state.userinfo;
    }
}

const actions = {
    async loadUserInfo(ctx) {
        const userinfo = await userinfoAPI.getUserInfo();
        ctx.commit('cacheUserInfo', userinfo);
    }
}

const mutations = {
    cacheUserInfo(state, userinfo) {
        state.userinfo = userinfo;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}