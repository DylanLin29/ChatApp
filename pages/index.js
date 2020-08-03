import { Component } from "react";
import io from "socket.io-client";
import CharactersList from "../components/charactersList";
import FriendsList from "../components/friendsList";
import Message from "../components/message";
class Home extends Component {
  // endPoint = "http://localhost:3000";
  // componentDidMount() {
  //   this.socket = io.connect(this.endPoint);
  //   this.socket.on("chat", (data) => {
  //     console.log("client side:", data);
  //   });
  //   this.socket.emit("chat", "hello server");
  // }
  // render() {
  //   return <p>Hello World</p>;
  // }
  render() {
    return <FriendsList />;
  }
}

export default Home;
