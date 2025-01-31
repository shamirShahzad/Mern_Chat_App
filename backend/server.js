require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const userRouter = require("./routes/userRoutes");
const groupRouter = require("./routes/groupRoutes");
const messageRouter = require("./routes/messageRoutes");
const http = require("http");
const socket = require("socket.io");
const socketIo = require("./socket");
const cors = require("cors");
const server = http.createServer(app);
const mongoose = require("mongoose");
const io = socket(server, {
  cors: {
    origin: ["http://localhost:5000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//Middlewares
app.use(cors());
app.use(express.json());

//Connect DB
mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err.message);
  });

//Initialize
socketIo(io);
//Routes
app.use("/api/users", userRouter);
app.use("/api/groups", groupRouter);
app.use("/api/messages", messageRouter);

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
