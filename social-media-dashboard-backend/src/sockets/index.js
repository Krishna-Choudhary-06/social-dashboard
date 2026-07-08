const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const logger = require("../config/logger");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // allow all or specify frontend domain
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    logger.info(`Client connected: ${socket.id} (User: ${socket.user.id})`);

    // Join a room specifically for this user
    socket.join(socket.user.id);

    socket.on("joinWorkspace", (workspaceId) => {
      logger.info(`User ${socket.user.id} joined workspace ${workspaceId}`);
      socket.join(`workspace_${workspaceId}`);
    });

    socket.on("leaveWorkspace", (workspaceId) => {
      socket.leave(`workspace_${workspaceId}`);
    });

    socket.on("disconnect", () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};

module.exports = {
  initSocket,
  getIO,
};
