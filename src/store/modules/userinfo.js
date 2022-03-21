import userinfoAPI from '@/api/userinfo.js'

const state = () => ({
    userinfo: {}
})

const getters = {
    getUserInfo: (state) => () => {
        return state.userinfo;
    },
    getUserName: (state) => (userID) => {
        if (state?.userinfo?.subject == userID) return state.userinfo.fullName;
        return "Unknown User";
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