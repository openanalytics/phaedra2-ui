import { defineStore } from "pinia"
import userinfoAPI from '@/api/userinfo.js'

export const useUserInfoStore = defineStore("userinfo" , {
    state: () => ({
        userInfo: {},
        userNames: {},
        userNamesLoaded: false
    }),
    actions: {
        async loadUserInfo() {
            const userInfo = await userinfoAPI.getUserInfo()
            this.userInfo = userInfo
        },
        async loadUserNames() {
            const userNames = await userinfoAPI.getUserList()
            this.userNames = userNames
        }
    }
})
