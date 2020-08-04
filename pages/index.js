import { Component } from "react";
import io from "socket.io-client";
import CharactersList from "../components/charactersList";
import FriendsList from "../components/friendsList";
import Message from "../components/message";
import Navbar from "../components/navbar";
class Home extends Component {
  render() {
    return (
      <div className="chat-page">
        <Navbar />
        <FriendsList />
        {/* <CharactersList /> */}
      </div>
    );
  }
}

export default Home;
