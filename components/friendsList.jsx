import { Input } from "semantic-ui-react";
import Message from "./message";
import { Component } from "react";
import io from "socket.io-client";
import axios from "axios";
const ENDPOINT = "http://localhost:3000";

class FriendsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: {
        id: "",
        content: "",
      },
      response: [],
    };
    this.socket = io(ENDPOINT);
    this.socket.on("RECEIVE_MESSAGE", (data) => {
      let updateResponses = this.state.response;
      updateResponses.push(data);
      this.setState({ response: updateResponses });
    });
  }

  async componentDidMount() {
    const userInfo = await axios.get("http://localhost:3000/api/auth");
    this.setState({ message: { id: userInfo.data.name, content: "" } });
    console.log(userInfo.data);
  }

  handleInputChange = ({ currentTarget: input }) => {
    const newMessage = { ...this.state.message };
    newMessage.content = input.value;
    this.setState({ message: newMessage });
  };

  handleInputEnter = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
    }
    const removeSpaces = this.state.message.content.replace(/\s/g, "");
    if (event.key === "Enter" && removeSpaces) {
      this.socket.emit("SEND_MESSAGE", this.state.message);
      const clearMessage = { ...this.state.message };
      clearMessage.content = "";
      this.setState({ message: clearMessage });
    }
  };

  render() {
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
              {this.state.response?.map(({ id, content }) => {
                return id === this.state.message.id ? (
                  <div className="chat-message chat-message-sent">
                    <Message messageType="message-sent" message={content} />
                    <img src="https://playjoor.com/assets/avatar/patrick.png" />
                  </div>
                ) : (
                  <div className="chat-message">
                    <img src="https://playjoor.com/assets/avatar/matthew.png" />
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FriendsList;
