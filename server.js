require("dotenv").config();
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const routes = require("./routes");
const { errorHandler, notFound } = require("./middleware/errors");
const { registerSocketHandlers } = require("./socket");
const { startEventListeners } = require("./events");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_ORIGIN || "*", methods: ["GET", "POST", "PATCH", "DELETE"] }
});
app.set("io", io);
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json({ limit: "1mb" }));
app.get("/", (req, res) => res.json({ success: true, message: "E-Commerce & Inventory API", docs: "/api" }));
app.get("/api", (req, res) => res.json({ success: true, modules: ["auth", "products", "cart", "orders", "reports"] }));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

registerSocketHandlers(io);
startEventListeners(io);

const port = process.env.PORT || 5000;
if (!process.env.MONGODB_URI || !process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error("Set MONGODB_URI, JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in .env");
  process.exit(1);
}
mongoose.connect(process.env.MONGODB_URI)
  .then(() => server.listen(port, () => console.log(`API and Socket.IO running on http://localhost:${port}`)))
  .catch(err => { console.error("MongoDB connection error:", err.message); process.exit(1); });

module.exports = { app, server };