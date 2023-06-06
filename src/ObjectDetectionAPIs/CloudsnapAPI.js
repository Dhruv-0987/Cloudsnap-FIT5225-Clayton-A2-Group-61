import axios from 'axios';

const CloudsnapApiService = {

    async uploadImage(selectedImageFile){
        return await axios.put(`http://localhost:8080/https://m101lriqy2.execute-api.us-east-1.amazonaws.com/dev/imagestorage5225/${selectedImageFile.name}`
        , selectedImageFile)
    },

    async findImagesByImage(selectedImageFile){
        return await axios.post(`http://localhost:8080/https://ksws1dwar7.execute-api.us-east-1.amazonaws.com/dev/find-by-image`, selectedImageFile)
    },

    async findImagesByTags(tagsObject){
        return await axios.post(`http://localhost:8080/https://eumhp5mzya.execute-api.us-east-1.amazonaws.com/dev/findImagesByTags`, tagsObject)
    },

    async updateTags(tagsObject){
        return await axios.post(`http://localhost:8080/https://igcjv08g13.execute-api.us-east-1.amazonaws.com/dev/updatetags`, tagsObject)
    },

    async deleteTags(tagsObject){
        return await axios.delete(`http://localhost:8080/https://yzrtqkkow5.execute-api.us-east-1.amazonaws.com/dev/deleteimages`, tagsObject)
    }
}


export default CloudsnapApiService;