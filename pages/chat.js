import Navbar from "../components/navbar";
import FriendsList from "../components/friendsList";
import { Component } from "react";
import axios from "axios";
const links = require("../config/links");

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: "",
        imagePath: "",
      },
    };
  }

  async componentDidMount() {
    const userInfo = await axios.get(links.auth, {
      withCredentials: true,
    });
    this.setState({ user: userInfo.data });
  }

  render() {
    const { user } = this.state;
    return (
      <>
        <Navbar user={user} />
        <FriendsList user={user} />
      </>
    );
  }
}

export default Chat;
