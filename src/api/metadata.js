import axios from "axios";

export default {
    async addTag(taggedObject) {
        const requestUrl = 'http://localhost:6020/phaedra/metadata-service/tag';
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
    async getObjectTags(objectId, objectClass) {
        let result = []
        await axios.get('http://localhost:6020/phaedra/metadata-service/tags',
            {params: {objectId: objectId, objectClass: objectClass}})
            .then(response => {
                if (response.status === 200)
                    result = response.data;
            })
            .catch(function (error){
                console.log(error);
                result = [];
            });
        return result;
    },
    async getObjectProperties(objectId, objectClass) {
        let result = [];
        await axios.get('http://localhost:6020/phaedra/metadata-service/properties',
            { params: { objectId: objectId, objectClass: objectClass }})
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
    async removeTag(taggedObject) {
        console.log('Making a backend call ...');

        const requestUrl = 'http://localhost:6020/phaedra/metadata-service/tag';
        let result = false;

        await axios.delete(requestUrl, { data: taggedObject })
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
    async removeProperty(property) {
        console.log('Making a backend call ...');

        const requestUrl = 'http://localhost:6020/phaedra/metadata-service/property';
        let result = false;
        await axios.delete(requestUrl, { params: { propertyName: property.propertyName, objectId: property.objectId, objectClass: property.objectClass }})
            .then(response => {
                if (response.status === 200)
                    result = true;
            })
            .catch(function (error) {
                console.log(error);
                result = false;
            });
        return result;
    }
}
