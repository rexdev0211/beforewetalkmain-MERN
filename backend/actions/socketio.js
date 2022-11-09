// const mongoose = require('mongoose');
// const { Message } = require('../models/Message');
// const { Room } = require('../models/Room');
// const { User } = require('../models/User');

const { find } = require("../config/stepTypes");

module.exports = {
    ADD_MESSAGE: async data => {

        const newMessage = await new Message({
            room: data.room,
            to: data.user._id == data.room.invited_user ? data.room.creator : data.room.invited_user,
            from: data.user._id,
            content: data.message,
            flowId: data.flowId
        }).save();

        return newMessage.populate('to').populate('from');
    },
    // GET_MESSAGES: async data => {
    //     return await Message.find({ room: data.room._id }).populate('user', [
    //         'username',
    //         'social',
    //         'handle',
    //         'image'
    //     ]);
    // },
    // CREATE_MESSAGE_CONTENT: (room, socketId) => {
    //     const user = room.previous.users.find(user => user.socketId === socketId);
    //     // return user && user.lookup && user.lookup.username
    //     //     ? `${user.lookup.username} has left ${room.updated.name}`
    //     //     : `Unknown User has left ${room.updated.name}`;
    //     return user && user.lookup && user.lookup.username
    //         ? null
    //         : null;
    // },
    // GET_ROOMS: async () => {
    //     return await Room.find({})
    //         .populate('user users.lookup', ['username', 'social', 'handle', 'image'])
    //         .select('-password');
    // },
    // GET_ROOM_USERS: async data => {
    //     return await Room.findById(data.room._id)
    //         .populate('user users.lookup', ['username', 'social', 'handle', 'image'])
    //         .select('-password');
    // },
    // UPDATE_ROOM_USERS: async data => {
    //     const room = await Room.findOne({ name: data.room.name })
    //         .select('-password')
    //         .populate('users.lookup', ['username', 'social', 'handle', 'image']);

    //     if (room) {
    //         if (
    //             room.users &&
    //             !room.users.find(user => user.lookup ? user.lookup._id.toString() === data.user._id : false)
    //         ) {
    //             room.users.push({
    //                 lookup: mongoose.Types.ObjectId(data.user._id),
    //                 socketId: data.socketId
    //             });
    //             const updatedRoom = await room.save();
    //             return await Room.populate(updatedRoom, {
    //                 path: 'user users.lookup',
    //                 select: 'username social image handle'
    //             });
    //         } else {
    //             // Update user socket id if the user already exists
    //             const existingUser = room.users.find(
    //                 user => user.lookup ? user.lookup._id.toString() === data.user._id : false
    //             );
    //             if (existingUser.socketId != data.socketId) {
    //                 existingUser.socketId = data.socketId;
    //                 await room.save();
    //             }
    //             return await Room.populate(room, {
    //                 path: 'user users.lookup',
    //                 select: 'username social image handle'
    //             });
    //         }
    //     } else {
    //         return;
    //     }
    // },
    // FILTER_ROOM_USERS: async data => {
    //     console.log('Filter Rooms');
    //     console.log(data);
    //     if (data.roomId) {
    //         const room = await Room.findById(mongoose.Types.ObjectId(data.roomId))
    //             .select('-password')
    //             .populate('users.lookup', ['username', 'social', 'handle', 'image']);
    //         if (room) {
    //             let previousUserState = Object.assign({}, room._doc);
    //             room.users = room.users.filter(user => user.socketId !== data.socketId);
    //             const updatedRoom = await room.save();
    //             return {
    //                 previous: previousUserState,
    //                 updated: await Room.populate(updatedRoom, {
    //                     path: 'user users.lookup',
    //                     select: 'username social image handle'
    //                 })
    //             };
    //         }
    //     }
    // }
};