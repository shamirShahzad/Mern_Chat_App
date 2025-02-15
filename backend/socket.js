const socketIo = (io) => {
  const connectedUsers = new Map();
  io.on("connection", (socket) => {
    //Get user for authentication
    const user = (socket.handshake = auth.user);
    console.log("user Connected", user?.username);
    //Join Room/Group
    socket.on("Join Room", (groupId) => {
      //Add socket to the specified room
      socket.join(groupId);
      //Store users and room in the connectedUsers Map
      connectedUsers.set(socket.id, { user, room: groupId });
      //Get list of all users in the room
      const usersInRoom = Array.from(connectedUsers.values())
        .filter((user) => {
          user.room === groupId;
        })
        .map((user) => user.user);
      io.in(groupId).emit("users in room", usersInRoom);
      socket.to(groupId).emit("notification", {
        type: "USER_JOINED",
        message: `${user?.username} has joined the group`,
        user: user,
      });
    });

    //Leaving a room
    socket.on("Leave Room", (groupId) => {
      console.log(`${user?.username} has left the group`);
      socket.leave(groupId);
      if (connectedUsers.has(socket.id)) {
        //Remove user from the connectedUsers Map
        connectedUsers.delete(socket.id);
        socket.to(groupId).emit("user left", user?._id);
      }
    });

    //Sending a message
    socket.on("new message", (groupId) => {
      socket.to(message.group).emit("message received", message);
    });

    //Disconnect
    socket.on("disconnect", () => {
      console.log("User Disconnected", user?.username);
      if (connectedUsers.has(socket.id)) {
        const userData = connectedUsers.get(socket.id);
        socket.to(userData.room).emit("user left", user?._id);
        connectedUsers.delete(socket.id);
      }
    });

    //Typing indicator
    socket.on("typing", ({ groupId, username }) => {
      socket.to(groupId).emit("user typing", username);
    });

    socket.on("stop typing", ({ groupId }) => {
      socket
        .to(groupId)
        .emit("user stopped typing", { username: user?.username });
    });
  });
};

module.exports = socketIo;
