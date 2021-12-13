import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/metadata-service';

export default {
    async addTag(taggedObject) {
        const requestUrl = apiURL + '/tag';
        let result = false;

        await axios.post(requestUrl, taggedObject)
            .then(response => {
                if (response.status === 201)
                    result = true;
            })
            .catch(function (error) {
                console.log(error);
                result = false;
            });
        return result;
    },
    async removeTag(taggedObject) {
        console.log('Making a backend call ...');

        const requestUrl = apiURL + '/tag';
        let result = false;

        await axios.delete(requestUrl, {data: taggedObject})
            .then(response => {
                if (response.status === 200)
                    result = true;
            })
            .catch(function (error) {
                console.log(error);
                result = false;
            });
        return result;
    },
    async getObjectTags(objectId, objectClass) {
        const requestUrl = apiURL + '/tags';
        let result = []

        await axios.get(requestUrl,
            {params: {objectId: objectId, objectClass: objectClass}})
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
                result = [];
            });
        return result;
    },
    async addProperty(property) {
        const requestUrl = apiURL + '/property';
        let result = false;

        axios.post(requestUrl, property)
            .then(response => {
                if (response.status === 201)
                    result = true;
            })
            .catch(function (error) {
                console.log(error);
                result = false;
            });
        return result;
    },
    async removeProperty(property) {
        const requestUrl = apiURL + '/property';
        let result = false;
        await axios.delete(requestUrl, {
            params: {
                propertyName: property.propertyName,
                objectId: property.objectId,
                objectClass: property.objectClass
            }
        })
            .then(response => {
                if (response.status === 200)
                    result = true;
            })
            .catch(function (error) {
                console.log(error);
                result = false;
            });
        return result;
    },
    async getObjectProperties(objectId, objectClass) {
        const requestUrl = apiURL + '/properties';
        let result = [];
        await axios.get(requestUrl,
            {params: {objectId: objectId, objectClass: objectClass}})
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error) {
                console.log(error);
                result = [];
            });
        return result;
    }
}
