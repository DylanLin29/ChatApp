const express = require("express");
const next = require("next");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const register = require("./routes/register");
const login = require("./routes/login");
const auth = require("./routes/auth");
const logout = require("./routes/logout");
const groups = require("./routes/groups");
const messages = require("./routes/messages");

nextApp
  .prepare()
  .then(() => {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    // Routes
    app.use("/api/register", register);
    app.use("/api/login", login);
    app.use("/api/auth", auth);
    app.use("/api/logout", logout);
    app.use("/api/groups", groups);
    app.use("/api/messages", messages);

    app.get("/register", (req, res) => {
      return nextApp.render(req, res, "/register", req.query);
    });

    app.get("/chat", (req, res) => {
      return nextApp.render(req, res, "/chat", req.query);
    });

    app.all("*", (req, res) => {
      return handle(req, res);
    });

    const server = app.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`Ready on ${PORT}`);
    });

    const socket = require("socket.io");
    const io = socket(server);

    io.on("connection", (socket) => {
      console.log(socket.id);

      socket.on("joinRoom", (room) => {
        socket.join(room);
      });

      socket.on("leaveRoom", (room) => {
        if (room) {
          socket.leave(room);
        }
      });

      socket.on("JOIN_GROUPCHAT", ({ userName, groupName }) => {
        io.to(groupName).emit("GROUP_NOTIFICATION", {
          id: undefined,
          content: `${userName} just joined ${groupName}`,
          imagePath: "",
        });
      });

      socket.on("LEAVE_GROUPCHAT", ({ userName, groupName }) => {
        io.to(groupName).emit("GROUP_NOTIFICATION", {
          id: undefined,
          content: `${userName} has left ${groupName}`,
          imagePath: "",
        });
      });

      socket.on("MESSAGE", ({ message, room }) => {
        io.to(room).emit("MESSAGE", message);
      });

      socket.on("TYPING", ({ name, room }) => {
        socket.to(room).broadcast.emit("TYPING", name);
      });
      socket.on("NOT_TYPING", (data) => {
        socket.broadcast.emit("NOT_TYPING", data);
      });

      socket.on("disconnect", () => {
        io.emit("DISCONNECT", "some one just left");
      });
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
