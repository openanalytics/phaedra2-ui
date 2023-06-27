import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/metadata-service';

export default {
    async addTag(taggedObject) {
        try {
            const response = await axios.post(`${apiURL}/tags`, taggedObject);
            return (response.status === 201);
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    async removeTag(taggedObject) {
        try {
            const response = await axios.delete(`${apiURL}/tags`, { data: taggedObject} );
            return (response.status === 200);
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    async getObjectTags(objectId, objectClass) {
        try {
            const response = await axios.get(`${apiURL}/tags`, {params: {objectId: objectId, objectClass: objectClass}});
            if (response.status === 200) return response.data;
        } catch (err) {
            console.log(err);
        }
        return [];
    },
    async addProperty(property) {
        try {
            const response = await axios.post(`${apiURL}/properties`, property);
            return (response.status === 201);
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    async removeProperty(property) {
        try {
            const response = await axios.delete(`${apiURL}/properties`, {
                params: {
                    propertyName: property.propertyName,
                    objectId: property.objectId,
                    objectClass: property.objectClass
                }
            });
            return (response.status === 200);
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    async getObjectProperties(objectId, objectClass) {
        try {
            const response = await axios.get(`${apiURL}/properties`, {params: {objectId: objectId, objectClass: objectClass}});
            if (response.status === 200) return response.data;
        } catch (err) {
            console.log(err);
        }
        return [];
    },
    async getMetadata(objectId, objectClass) {
        try {
            const objectIdArg = Array.isArray(objectId) ? objectId.join(',') : objectId;
            const response = await axios.get(`${apiURL}/metadata`, {params: {objectId: objectIdArg, objectClass: objectClass}});
            if (response.status === 200) return response.data;
        } catch (err) {
            console.log(err);
        }
        return [];
    }
}
