import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import http from "http";
import { Server } from "socket.io";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

// Routes & Models
import Message from "./Models/Message.js";
import { authrouter } from "./Routes/auth.js";
import { groupRouter } from "./Routes/group.js";
import { userRouter } from "./Routes/user.js";
import { expenserouter } from "./Routes/expense.js";
import { recentRouter } from "./Routes/recent.js";
import { settlerouter } from "./Routes/settle.js";
import { settleboundryrouter } from "./Routes/settleboundry.js";
import { groupsettlerouter } from "./Routes/groupsettle.js";
import { messagerouter } from "./Routes/message.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === "production";

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 🧩 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: MONGO_URI,
      collectionName: "sessions",
      ttl: 60 * 60 * 24,
      autoRemove: "interval",
      autoRemoveInterval: 10,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "none",
      secure: isProduction, // ⚠️ Secure only in production (HTTPS)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 🛡️ Production CORS
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 🔐 Security Headers (Helmet-like, optional enhancement)
app.disable("x-powered-by");

// 🌍 Routes
app.use("/auth", authrouter);
app.use("/group", groupRouter);
app.use("/user", userRouter);
app.use("/expense", expenserouter);
app.use("/recent", recentRouter);
app.use("/settle", settlerouter);
app.use("/settleboundry", settleboundryrouter);
app.use("/groupsettle", groupsettlerouter);
app.use("/message", messagerouter);

// 🔗 MongoDB Connection
async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}
connectDB();

// 🎮 Socket.IO logic
const groupUserCount = {};

io.on("connection", (socket) => {
  console.log("⚡ Connected:", socket.id);

  socket.on("join-room", (groupId) => {
    socket.join(groupId);
    if (!groupUserCount[groupId]) groupUserCount[groupId] = new Set();
    groupUserCount[groupId].add(socket.id);
    io.to(groupId).emit("group-user-count", groupUserCount[groupId].size);
  });

  socket.on("send-message", async (data) => {
    const { group, sender, text, senderName, senderPicture } = data;
    try {
      const message = await Message.create({
        sender,
        group,
        text,
        senderName,
        senderPicture,
      });
      io.to(group).emit("receive-message", {
        _id: message._id,
        sender,
        group,
        text,
        senderName,
        senderPicture,
        createdAt: message.createdAt,
      });
    } catch (err) {
      console.error("❌ Message error:", err);
    }
  });

  socket.on("leave-room", (groupId) => {
    socket.leave(groupId);
    groupUserCount[groupId]?.delete(socket.id);
    io.to(groupId).emit("group-user-count", groupUserCount[groupId]?.size || 0);
  });

  socket.on("disconnect", () => {
    for (const groupId in groupUserCount) {
      if (groupUserCount[groupId].has(socket.id)) {
        groupUserCount[groupId].delete(socket.id);
        io.to(groupId).emit("group-user-count", groupUserCount[groupId].size);
      }
    }
  });
});

// 🧾 Serve frontend (if production)
if (isProduction) {
  const frontendPath = path.resolve(__dirname, "../client/dist"); // Vite default
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT} ${isProduction ? "🔒 (Production)" : "🧪 (Dev)"}`);
});
