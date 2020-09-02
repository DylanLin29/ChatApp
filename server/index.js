const express = require("express");
const next = require("next");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const users = require("./routes/users");
const login = require("./routes/login");
const auth = require("./routes/auth");
const logout = require("./routes/logout");
const groups = require("./routes/groups");
const messages = require("./routes/messages");

const axios = require("axios");
const links = require("../config/links");

nextApp
  .prepare()
  .then(() => {
    const app = express();
    const http = require("http").createServer(app);

    app.use(express.json());
    app.use(cookieParser());

    // Routes
    app.use("/api/users", users);
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

    http.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`Ready on ${PORT}`);
    });

    const socket = require("socket.io");
    const io = socket(http);
    const usersList = {};

    io.on("connection", (socket) => {
      console.log(socket.id);

      socket.on("setUserName", (userName) => {
        usersList[userName] = socket;
        io.emit("USER_STATUS", { userName: userName, status: true });
      });

      socket.on("joinRoom", (room) => {
        socket.join(room);
      });

      socket.on("leaveRoom", (room) => {
        if (room) {
          socket.leave(room);
        }
      });

      // Send group notification when users join the groupchat
      // update the members list
      socket.on("JOIN_GROUPCHAT", async ({ userName, groupName }) => {
        const membersData = await axios.get(`${links.groups}/members`, {
          params: { groupName: groupName },
        });
        io.to(groupName).emit("GROUP_NOTIFICATION", {
          id: undefined,
          content: `${userName} just joined ${groupName}`,
          imagePath: "",
        });
        io.to(groupName).emit("MEMBERS_LIST", {
          members: membersData.data.userList,
        });
      });

      // Send group notificatino when users leave the groupchat
      // update the members list
      socket.on("LEAVE_GROUPCHAT", async ({ userName, groupName }) => {
        const membersData = await axios.get(`${links.groups}/members`, {
          params: { groupName: groupName },
        });
        io.to(groupName).emit("GROUP_NOTIFICATION", {
          id: undefined,
          content: `${userName} has left ${groupName}`,
          imagePath: "",
        });
        io.to(groupName).emit("MEMBERS_LIST", {
          members: membersData.data.userList,
        });
      });

      // Group Message
      socket.on("MESSAGE", ({ message, room }) => {
        io.to(room).emit("MESSAGE", message);
      });

      // Private Message
      socket.on("PRIVATE_MESSAGE", ({ message, friendName }) => {
        if (usersList[friendName]) {
          usersList[friendName].emit("PRIVATE_MESSAGE", message);
        }
        socket.emit("PRIVATE_MESSAGE", message);
      });

      socket.on("USER_STATUS", (userName) => {
        if (usersList[userName]) {
          socket.emit("USER_STATUS", { userName: userName, status: true });
        } else {
          socket.emit("USER_STATUS", { userName: userName, status: false });
        }
      });

      socket.on("TYPING", ({ name, room }) => {
        socket.to(room).broadcast.emit("TYPING", name);
      });
      socket.on("NOT_TYPING", (data) => {
        socket.broadcast.emit("NOT_TYPING", data);
      });

      socket.on("FRIEND_REQUEST", ({ userName, friendName }) => {
        if (usersList[friendName]) {
          usersList[friendName].emit("FRIEND_REQUEST", userName);
        }
      });

      socket.on("ADD_FRIEND", ({ userName, friendName }) => {
        if (usersList[friendName]) {
          usersList[friendName].emit("ADD_FRIEND", userName);
        }
      });

      socket.on("DELETE_FRIEND", ({ userName, friendName }) => {
        console.log(usersList);
        if (usersList[userName]) {
          usersList[userName].emit("DELETE_FRIEND", friendName);
        }
      });

      socket.on("DELETE_GROUP", ({ adminName, groupName, userList }) => {
        for (let i = 0; i < userList.length; i++) {
          if (usersList[userList[i].name]) {
            usersList[userList[i].name].emit("DELETE_GROUP", {
              adminName: adminName,
              groupName: groupName,
            });
          }
        }
      });

      socket.on("DELETE_MEMBER", ({ groupName, userName }) => {
        if (usersList[userName]) {
          usersList[userName].emit("DELETE_MEMBER", {
            groupName: groupName,
            userName: userName,
          });
        }
      });

      socket.on("LOGOUT", (userName) => {
        delete usersList[userName];
        io.emit("USER_STATUS", { userName: userName, status: false });
      });
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
