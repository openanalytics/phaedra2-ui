import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/plate-service';

export default {
    async getProjectById(id) {
        try {
            const response = await axios.get(apiURL + '/project/' + id);
            if (response.status === 200) return response.data;
        } catch (err) {
            console.log(err);
        }
    },
    async getProjectAccess(projectId) {
        try {
            const response = await axios.get(apiURL + '/project-access/' + projectId);
            if (response.status === 200) return response.data;
        } catch (err) {
            console.log(err);
        }
    },
    async createProjectAccess(projectAccess) {
        try {
            const response = await axios.post(apiURL + '/project-access', projectAccess);
            if (response.status === 201) return response.data;
        } catch (err) {
            console.log(err);
        }
    },
    async deleteProjectAccess(projectAccessId) {
        try {
            const response = await axios.delete(apiURL + '/project-access/' + projectAccessId);
            if (response.status === 200) return response.data;
        } catch (err) {
            console.log(err);
        }
    },
    async getAllProjects() {
        try {
            const response = await axios.get(apiURL + '/projects');
            if (response.status === 200) return response.data;
        } catch (err) {
            console.log(err);
        }
    },
    async loadRecentProjects() {
        try {
            const response = await axios.get(apiURL + '/projects');
            if (response.status === 200) return response.data;
        } catch (err) {
            console.log(err);
        }
    },
    async deleteProject(id) {
        try {
            const response = await axios.delete(apiURL + '/project/' + id);
            if (response.status === 200) return response.data;
        } catch (err) {
            console.log(err);
        }
    },
    async editProject(args) {
        try {
            const response = await axios.put(apiURL + '/project', args);
            if (response.status === 200) return response.data;
        } catch (err) {
            console.log(err);
        }
    },
    async createNewProject(newProject) {
        try {
            const response = await axios.post(apiURL + '/project', newProject);
            if (response.status === 201) return response.data;
        } catch (err) {
            console.log(err);
        }
    },
}
