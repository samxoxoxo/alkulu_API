var mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imageName: {
        type: String,
        default: "true"
    },
    imageData: {
        type: String,
    }
})

module.exports = mongoose.model('img', imageSchema, 'imgSchema');