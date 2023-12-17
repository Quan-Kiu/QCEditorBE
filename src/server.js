const { createServer } = require("http");
const { Server } = require("socket.io");
const { SOCKET_ACTION } = require("./socketAction");

const httpServer = createServer();

const io = new Server(httpServer, {
  path: "/socket",
  cors: {
    origin: "*",
  },
});

const roomsData = new Map();

const users = new Map();

const getUsers = () => {
  return [...users].map((user) => user[1]);
};

const loopRooms = (rooms, cb) => {
  rooms.forEach((roomId) => {
    cb(roomId);
  });
};

io.on("connection", (socket) => {
  socket.on(SOCKET_ACTION.JOIN, ({ roomId, user }) => {
    socket.join(roomId);
    users.set(socket.id, user);
    socket.to(roomId).emit(SOCKET_ACTION.NEW_USERS, getUsers());
    io.to(socket.id).emit(SOCKET_ACTION.JOIN_SUCCESS, getUsers());
    io.to(socket.id).emit(SOCKET_ACTION.INIT_FILES, roomsData.get(roomId));
  });
  socket.on(SOCKET_ACTION.CODE_CHANGED_TO_SERVER, (...data) => {
    const rooms = socket?.rooms;
    if (rooms) {
      rooms.forEach((roomId) => {
        roomsData.set(roomId, data[2]);
        socket
          .to(roomId)
          .emit(SOCKET_ACTION.CODE_CHANGED_TO_CLIENT, data[0], data[1]);
      });
    }
  });
  socket.on(SOCKET_ACTION.ADD_FILE_TO_SERVER, (data) => {
    loopRooms(socket.rooms, (roomId) =>
      socket.to(roomId).emit(SOCKET_ACTION.ADD_FILE_TO_CLIENT, data)
    );
  });
  socket.on(SOCKET_ACTION.DELETE_FILE_TO_SERVER, (data) => {
    loopRooms(socket.rooms, (roomId) =>
      socket.to(roomId).emit(SOCKET_ACTION.DELETE_FILE_TO_CLIENT, data)
    );
  });

  socket.on("disconnect", () => {
    const rooms = socket?.rooms;
    if (rooms) {
      rooms.forEach((roomId) => {
        socket.to(roomId).emit(SOCKET_ACTION.LEAVE, getUsers());
      });
    }
    users.delete(socket.id);
  });
});

httpServer.listen(5000, () => {
  console.log(`> Ready on http://localhost:${process.env.PORT || 5000}`);
});
