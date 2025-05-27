const {Schema, model} = require("mongoose");
const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    authors: {
        type: String,
        required: true,
    },
    favorite: String,
    fileCover: String,
    fileName: String,
    comments: {
        type: [String],
        default: []
    }
});

module.exports = model('books', bookSchema);