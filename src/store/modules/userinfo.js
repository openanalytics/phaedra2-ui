// import userinfoAPI from '@/api/userinfo.js'
//
// const state = () => ({
//     userInfo: {},
//     userNames: {},
//     userNamesLoaded: false
// })
//
// const getters = {
//     getUserInfo: (state) => () => {
//         return state.userInfo;
//     },
//     getUserName: (state) => (userID) => {
//         return state.userNames[userID] || "Unknown";
//     },
//     areUserNamesLoaded: (state) => () => {
//         return state.userNamesLoaded;
//     },
// }
//
// const actions = {
//     async loadUserInfo(ctx) {
//         const userinfo = await userinfoAPI.getUserInfo();
//         ctx.commit('cacheUserInfo', userinfo);
//     },
//     async loadUserNames(ctx) {
//         const userNames = await userinfoAPI.getUserList();
//         ctx.commit('cacheUserNames', userNames);
//     }
// }
//
// const mutations = {
//     cacheUserInfo(state, userInfo) {
//         state.userInfo = userInfo;
//     },
//     cacheUserNames(state, userNames) {
//         state.userNames = userNames;
//         state.userNamesLoaded = true;
//     }
// }
//
// export default {
//     namespaced: true,
//     state,
//     getters,
//     actions,
//     mutations
// }
