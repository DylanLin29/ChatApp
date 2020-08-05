const express = require("express");
const next = require("next");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const register = require("./routes/register");
const auth = require("./routes/auth");

nextApp
  .prepare()
  .then(() => {
    const app = express();

    app.use(express.json());
    app.use(cookieParser());

    // Routes
    app.use("/api/register", register);
    app.use("/api/auth", auth);

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

      socket.on("SEND_MESSAGE", function (data) {
        io.emit("RECEIVE_MESSAGE", data);
      });

      socket.on("TYPING", (data) => {
        socket.broadcast.emit("TYPING", data);
      });
      socket.on("NOT_TYPING", (data) => {
        socket.broadcast.emit("NOT_TYPING", data);
      });
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
