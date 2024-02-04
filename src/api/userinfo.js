import axios from "axios";

const apiURL = (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL).replace('/api/v1', '');

const mockData = {
    enabled: (process.env.NODE_ENV == "development"),
    userInfo: {
        data: {
            fullName: "Developer",
            claims: { realm_access: { "roles": ["default-roles-phaedra2","offline_access","uma_authorization",
                "phaedra2-user",
                "phaedra2-admin",
                "phaedra2-team-TeamX",
                "phaedra2-team-TeamY"
            ]}}
        }
    },
    users: { data: [] }
};

export default {
    apiURL,
    async getUserInfo() {
        try {
            const response = mockData.enabled ? mockData.userInfo : await axios.get(apiURL + '/userinfo');
            const userInfo = response.data;
            userInfo.teams = userInfo.claims?.realm_access?.roles
                .filter(role => role.startsWith("phaedra2-team-"))
                .map(role => role.substring("phaedra2-team-".length))
                .sort() || [];
            userInfo.admin = userInfo.claims?.realm_access?.roles.includes("phaedra2-admin");

            return userInfo;
        } catch (err) {
            return {
                fullName: "Unknown User",
                teams: []
            };
        }
    },

    async getUserList() {
        const response = mockData.enabled ? mockData.users : await axios.get(apiURL + '/users');
        return response.data;
    },
    async logout() {
        const response = await axios.get(apiURL + '/userlogout');
        return response.data
    }
}
