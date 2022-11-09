const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        default: ''
    },
    meeting: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        default: ''
    },
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
