import axios from "axios";

const apiURL = process.env.VUE_APP_API_BASE_URL + '/metadata-service';

export default {
    async getObjectTags(objectType, objectId) {
        let response = await axios.get(apiURL + '/tagged_objects/' + objectType, {params: {objectId: objectId}});
        return response.data;
    },
    async addObjectTag(tagInfo) {
        await axios.post(apiURL + '/tags', tagInfo);
    },
    async removeObjectTag(tagInfo) {
        await axios.delete(apiURL + '/tags', {data: tagInfo});
    },
    async addObjectProperty(propertyInfo) {
        await axios.post(apiURL + '/properties', propertyInfo);
    },
}
