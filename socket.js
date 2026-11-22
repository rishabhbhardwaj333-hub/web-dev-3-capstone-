const jwt = require("jsonwebtoken");
const User = require("./models/User");
function registerSocketHandlers(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(payload.sub);
      if (!user || !user.isActive) return next(new Error("Unauthorized"));
      socket.userId = String(user._id);
      next();
    } catch (err) { next(new Error("Invalid socket token")); }
  });
  io.on("connection", socket => {
    socket.join(`user:${socket.userId}`);
    socket.emit("connection:ready", { userId: socket.userId });
  });
}
module.exports = { registerSocketHandlers };