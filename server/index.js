const express = require("express");
const next = require("next");
const { default: Server } = require("next/dist/next-server/server/next-server");

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp
  .prepare()
  .then(() => {
    const app = express();

    app.all("*", (req, res) => {
      return handle(req, res);
    });

    const server = app.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`Ready on ${PORT}`);
    });

    const socket = require("socket.io");
    const io = socket(server);

    // io.on("connection", (socket) => {
    //   console.log("Make socket connection with ", socket.id);
    //   socket.on("chat", (data) => {
    //     io.sockets.emit("chat", "hello client");
    //     console.log(data);
    //   });
    // });
    io.on("connection", (socket) => {
      console.log(socket.id);

      socket.on("SEND_MESSAGE", function (data) {
        console.log(data);
        io.emit("RECEIVE_MESSAGE", data);
      });
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
