const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    apiKey: { 
        type: String
     } 
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};