// import axios from "axios";

// export default {
//     async getTagsByPlateId(plateId) {
//         let result = null;
//         await axios.get('http://localhost:6020/phaedra/metadata-service/tagged_objects/PLATE',
//             {params: {objectId: plateId}})
//             .then(response => {
//                 result = response.data;
//             });
//         return result;
//     },
//     addTag(tagInfo) {
//         axios.post('http://localhost:6020/phaedra/metadata-service/tags', tagInfo)
//             .then(response => {
//                 if (response.status === 201) {
//                     console.log(response)
//                 }
//             });
//     }
// }
