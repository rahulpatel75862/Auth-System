const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    question: {
        type:String,
        required: true,
        unique: true,
        trim: true
    },
    option1: {
        type:String,
        required: true,
        unique: true,
        trim: true
    },
    option2: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    option3: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    author: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true}
}, {timestamps: true});

module.exports = mongoose.model("Post", postSchema)