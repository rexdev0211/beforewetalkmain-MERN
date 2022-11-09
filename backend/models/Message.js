const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema for Users
const MessageSchema = new Schema({
    room: {
        type: Schema.Types.ObjectId,
        ref: 'rooms'
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    content: {
        type: String,
        required: true,
    },
    flowId: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    // + 5 * 365 * 24 * 60 * 60 * 1000
});

module.exports = Message = mongoose.model('messages', MessageSchema);
