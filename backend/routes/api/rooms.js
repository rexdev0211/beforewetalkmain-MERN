const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middlewares/auth");
const Room = require("../../models/Room");

/**
 * Create a new flow
 */

router.get("/", authMiddleware, async (req, res) => {
    const rooms = await Room.find({
        $or: [{ creator: req.user._id },
        { invited_user: req.user._id }]
    }).populate('creator').populate('invited_user');

    return res.json({ rooms });
});

router.post("/create", authMiddleware, async (req, res) => {
    // Flow input validation
    // const invited_user = req.user;
    const room = await Room.create({
        creator: req.user,
        room_name: "room_" + req.body.flowId,
        flow_id: req.body.flowId,
        invited_user: null
    });

    console.log("room created", room)

    return res.json({ room: room });
});

router.get("/getByFlowId/:flowId", authMiddleware, async (req, res) => {
    const room = await Room.findOne({ flow_id: req.params.flowId });
    return res.json({ room: room });
});

router.put("/update/:flowId", authMiddleware, async (req, res) => {
    // Flow input validation
    const room = await Room.findOne({ flow_id: req.params.flowId });
    if (room.creator != req.user._id) {
        const updatedRoom = await Room.findOneAndUpdate({ flow_id: req.params.flowId }, { invited_user: req.user }, { new: true }).populate('invited_user').populate('creator');
        return res.json({ room: updatedRoom });
    }
    else {
        return res.json({ room: room });
    }
});

module.exports = router;
