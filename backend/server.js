const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const passport = require("passport");
const cors = require("cors");
const dotenv = require('dotenv');
const http = require('http');
dotenv.config();

const messages = require("./routes/api/messages");
const auth = require("./routes/api/auth");
const flows = require("./routes/api/flows");
const steps = require("./routes/api/steps");
const rooms = require("./routes/api/rooms");

const app = express();

const {
  ADD_MESSAGE,
  UPDATE_ROOM_USERS,
  GET_ROOMS,
  GET_ROOM_USERS,
  FILTER_ROOM_USERS,
  CREATE_MESSAGE_CONTENT
} = require('./actions/socketio');


// Port that the webserver listens to
const port = process.env.PORT || 5000;

// const server = app.listen(port, () =>
//   console.log(`Server running on port ${port}`)
// );

const server = http.createServer(app);

const io = require('socket.io')(server, {
  origins: ["http://localhost:3000"]
});

// Body Parser middleware to parse request bodies
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// CORS middleware
app.use(cors());

// Database configuration
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Successfully Connected"))
  .catch((err) => console.log(err));

// // Passport middleware
// app.use(passport.initialize());
// // Passport config
// require("./config/passport")(passport);

// Assign socket object to every request
// app.use(function (req, res, next) {
//   req.io = io;
//   next();
// });

// Routes
app.use("/messages", messages);
app.use("/auth", auth);
app.use("/flows", flows);
app.use("/steps", steps);
app.use("/rooms", rooms);
// app.set('io', io);

io.on('connection', socket => {
  socket.on('JoinRoom', data => {

    console.log("JoinRoomData", data)
    socket.join(data.room._id)
    io.emit('UserJoined', data);
  });
  socket.on('newMessage', async data => {
    console.log("newMessage", data)
    const newMessage = await ADD_MESSAGE(data);

    io.to(data.room._id).emit('sendMessage', data);
  });
});

server.listen(port, err => {
  if (err) {
    console.log("Server err", err)
  }
  console.log("Server running on the Port:", port)
})
