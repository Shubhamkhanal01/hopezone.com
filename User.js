const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    profileImage: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Check if model exists before creating it
module.exports = mongoose.models.User || mongoose.model('User', userSchema); 