import axios from "axios";

const apiURL = (config.VUE_APP_API_BASE_URL || process.env.VUE_APP_API_BASE_URL) + '/plate-service';

export default {
    async getProjectById(id) {
        const response = await axios.get(`${apiURL}/projects/${id}`);
        if (response.status === 200) return response.data;
    },
    async getAllProjects() {
        const response = await axios.get(`${apiURL}/projects`);
        if (response.status === 200) return response.data;
    },
    async deleteProject(id) {
        const response = await axios.delete(`${apiURL}/projects/${id}`);
        if (response.status === 200) return response.data;
    },
    async editProject(args) {
        const response = await axios.put(`${apiURL}/projects/${args.id}`, args);
        if (response.status === 200) return response.data;
    },
    async createNewProject(newProject) {
        const response = await axios.post(`${apiURL}/projects`, newProject);
        if (response.status === 201) return response.data;
    },

    async getProjectAccess(projectId) {
        const response = await axios.get(`${apiURL}/projectaccess/${projectId}`);
        if (response.status === 200) return response.data;
    },
    async createProjectAccess(projectAccess) {
        const response = await axios.post(`${apiURL}/projectaccess`, projectAccess);
        if (response.status === 201) return response.data;
    },
    async deleteProjectAccess(projectAccessId) {
        const response = await axios.delete(`${apiURL}/projectaccess/${projectAccessId}`);
        if (response.status === 200) return response.data;
    },
}
