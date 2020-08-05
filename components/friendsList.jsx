import { Input } from "semantic-ui-react";
import Message from "./message";
import { Component } from "react";
import io from "socket.io-client";
import _ from "lodash";
const ENDPOINT = "http://localhost:3000";
var timeout = undefined;

class FriendsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: "",
        imagePath: "",
      },
      message: {
        id: "",
        imagePath: "",
        content: "",
      },
      response: [],
      typingUser: "",
    };
    this.socket = io(ENDPOINT);
    this.socket.on("RECEIVE_MESSAGE", (data) => {
      let updateResponses = this.state.response;
      updateResponses.push(data);
      this.setState({ response: updateResponses });
    });

    this.socket.on("TYPING", (data) => {
      this.setState({ typingUser: data });
    });

    this.socket.on("NOT_TYPING", (data) => {
      if (this.state.typingUser === data) {
        this.setState({ typingUser: "" });
      }
    });
  }

  handleInputChange = ({ currentTarget: input }) => {
    const newMessage = { ...this.state.message };
    newMessage.content = input.value;
    newMessage.id = this.props.user.name;
    newMessage.imagePath = this.props.user.imagePath;
    this.setState({ message: newMessage });
  };

  handleNoTyping = () => {
    this.socket.emit("NOT_TYPING", this.props.user.name);
  };

  handleInputEnter = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
    }

    if (event.key !== "Enter") {
      this.socket.emit("TYPING", this.props.user.name);
      clearTimeout(timeout);
      timeout = setTimeout(this.handleNoTyping, 5000);
    } else {
      const removeSpaces = this.state.message.content.replace(/\s/g, "");
      if (event.key === "Enter" && removeSpaces) {
        this.socket.emit("SEND_MESSAGE", this.state.message);
        clearTimeout(timeout);
        this.socket.emit("NOT_TYPING", this.props.user.name);
        const clearMessage = { ...this.state.message };
        clearMessage.content = "";
        this.setState({ message: clearMessage });
      }
    }
  };

  render() {
    console.log(this.state.typingUser);
    return (
      <div>
        <div className="chat-window">
          <div className="friends-list-container">
            <div className="search-area">
              <Input placeholder="Search..." />
            </div>
            <div className="friends-list">
              <div className="friend-info">
                <img src="https://playjoor.com/assets/avatar/matthew.png" />
                <span>Matthew</span>
              </div>
              <div className="friend-info">
                <img src="https://playjoor.com/assets/avatar/jenny.jpg" />
                <span>Jenny</span>
              </div>
              <div className="friend-info">
                <img src="https://playjoor.com/assets/avatar/joe.jpg" />
                <span>Joe</span>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="chat-window-current-title">
              <img src="https://playjoor.com/assets/avatar/matthew.png" />
              <span>Matthew</span>
            </div>
            <div className="chat-message-wrapper">
              {this.state.response?.map(({ id, content, imagePath }) => {
                return id === this.props.user.name ? (
                  <div className="chat-message chat-message-sent">
                    <Message messageType="message-sent" message={content} />
                    <img src={this.props.user.imagePath} />
                  </div>
                ) : (
                  <div className="chat-message">
                    <img src={imagePath} />
                    <Message messageType="message-receive" message={content} />
                  </div>
                );
              })}
            </div>
            <div className="chat-input">
              <textarea
                type="text"
                placeholder="Message to Mattew"
                onKeyDown={(event) => this.handleInputEnter(event)}
                onChange={(event) => this.handleInputChange(event)}
                value={this.state.message.content}
              />
              {this.state.typingUser && (
                <p>{this.state.typingUser} is typing...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FriendsList;
