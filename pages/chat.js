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
        _id: "",
        groups: [],
      },
    };
  }

  async componentDidMount() {
    const userInfo = await axios.get(links.auth, {
      withCredentials: true,
    });
    this.setState({ user: userInfo.data });
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

  render() {
    const { user } = this.state;
    return (
      <>
        <Navbar user={user} />
        <FriendsList
          user={user}
          handleCreateFormDoSubmit={this.handleCreateFormDoSubmit}
        />
      </>
    );
  }
}

export default Chat;
