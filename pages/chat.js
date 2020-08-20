import Navbar from "../components/navbar";
import ChatSection from "../components/chatSection";
import { Component } from "react";
import axios from "axios";
import io from "socket.io-client";
const links = require("../config/links");
const socket = io(links.connection);

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: "",
        imagePath: "",
        _id: "",
        groups: [],
        friends: [],
      },
      requests: [],
    };
  }

  async componentDidMount() {
    const userInfo = await axios.get(links.auth, {
      withCredentials: true,
    });

    if (userInfo.data.name) {
      socket.emit("setUserName", userInfo.data.name);
    }

    if (userInfo.data) {
      const friendRequestResult = await axios.get(
        `${links.users}/friendRequest`,
        {
          params: {
            userName: userInfo.data.name,
          },
        }
      );
      this.setState({
        user: userInfo.data,
        requests: friendRequestResult.data.requests,
      });
    } else {
      this.setState({ user: userInfo.data });
    }

    socket.on("FRIEND_REQUEST", (requestSenderName) => {
      let requests = this.state.requests;
      requests.push(requestSenderName);
      this.setState({ requests });
    });

    socket.on("ADD_FRIEND", async (friendName) => {
      const userInfo = await axios.get(links.users, {
        params: { name: friendName },
      });
      const user = { ...this.state.user };
      let friends = user.friends;
      friends.push(userInfo.data.user);
      user.friends = friends;
      this.setState({ user });
    });
  }

  handleCreateFormDoSubmit = async (name, imagePath) => {
    const result = await axios.post(links.groups, {
      name: name,
      imagePath: imagePath,
      _id: this.state.user._id,
    });
    const user = { ...this.state.user };
    user.groups = result.data.groups;
    this.setState({ user: user });
  };

  handleJoinFormDoSubmit = async (groupName) => {
    const result = await axios.post(`${links.groups}/join`, {
      groupName: groupName,
      userId: this.state.user._id,
    });
    const user = { ...this.state.user };
    user.groups = result.data.groups;
    this.setState({ user: user });
  };

  handleFriendRequestDecline = async (requestSenderName) => {
    const requestsInfo = await axios.post(
      `${links.users}/friendRequest/decline`,
      {
        userName: this.state.user.name,
        friendRequestName: requestSenderName,
      }
    );
    this.setState({ requests: requestsInfo.data.requests });
  };

  handleFriendRequestAccept = async (requestSenderName) => {
    socket.emit("ADD_FRIEND", {
      userName: this.state.user.name,
      friendName: requestSenderName,
    });
    const friendsInfo = await axios.post(
      `${links.users}/friendRequest/accept`,
      {
        userName: this.state.user.name,
        friendRequestName: requestSenderName,
      }
    );
    const user = { ...this.state.user };
    user.friends = friendsInfo.data.friendsList;
    this.setState({ user, requests: friendsInfo.data.requests });
  };

  handleUserUpdate = (user) => {
    this.setState({ user });
  };

  render() {
    const { user, requests } = this.state;
    return (
      <>
        <Navbar
          user={user}
          requests={requests}
          handleFriendRequestDecline={this.handleFriendRequestDecline}
          handleFriendRequestAccept={this.handleFriendRequestAccept}
          socket={socket}
        />
        <ChatSection
          user={user}
          handleCreateFormDoSubmit={this.handleCreateFormDoSubmit}
          handleJoinFormDoSubmit={this.handleJoinFormDoSubmit}
          handleUserUpdate={this.handleUserUpdate}
          socket={socket}
        />
      </>
    );
  }
}

export default Chat;
