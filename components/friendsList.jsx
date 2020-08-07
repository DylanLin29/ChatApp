import { Input } from "semantic-ui-react";
import { Component } from "react";
import io from "socket.io-client";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import Message from "./message";
import CreateGroupForm from "../components/chatPageComponents/createGroupForm";
import axios from "axios";
const links = require("../config/links");
const ENDPOINT = links.connection;
var timeout = undefined;

class FriendsList extends Component {
  constructor(props) {
    super(props);

    this.messagesRef = React.createRef();
    this.searchRef = React.createRef();

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
      currentChat: {
        name: "",
        imagePath: "",
      },
      addButtonClick: false,
      createFormOpen: false,
    };
  }

  componentDidMount() {
    this.socket = io(ENDPOINT);

    // listen to the server
    this.socket.on("RECEIVE_MESSAGE", (data) => {
      let updateResponses = this.state.response;
      updateResponses.push(data);
      this.setState({ response: updateResponses });
      // set the messages always view at the bottom
      this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight;
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

  handleOpenChat = (name, imagePath) => {
    this.setState({
      currentChat: { name: name, imagePath: imagePath },
    });
  };

  handleAddClick = () => {
    this.setState({ addButtonClick: true, createFormOpen: false });
  };

  handleJoinClick = () => {
    this.setState({ addButtonClick: false });
    this.searchRef.current.focus();
  };

  handleCreateClick = () => {
    this.setState({ createFormOpen: true, addButtonClick: false });
  };

  handleCreateFormClose = () => {
    this.setState({ createFormOpen: false });
  };

  handleCreateFormSubmit = async (name, imagePath) => {
    await axios.post(links.createGroup, {
      name: name,
      imagePath: imagePath,
      _id: this.props.user._id,
    });
    this.setState({ createFormOpen: false });
  };

  render() {
    return (
      <div>
        <div className="chat-window">
          <div className="friends-list-container">
            <div className="search-area">
              <Input placeholder="Search..." ref={this.searchRef} />
              <FontAwesomeIcon
                icon={faPlusSquare}
                size="2x"
                onClick={this.handleAddClick}
              />
            </div>
            <div className="friends-list">
              {this.props.user.groups.map(({ name, imagePath }) => {
                return (
                  <div
                    className="friend-info"
                    onClick={() => this.handleOpenChat(name, imagePath)}
                  >
                    <img src={imagePath} />
                    <span>{name}</span>
                  </div>
                );
              })}
              {/* <div className="friend-info" onClick={this.handleOpenChat}>
                <img src="../images/groupChat.png" />
                <span>Group Chat</span>
              </div>
              <div className="friend-info">
                <img src="https://playjoor.com/assets/avatar/jenny.jpg" />
                <span>Jenny</span>
              </div>
              <div className="friend-info">
                <img src="https://playjoor.com/assets/avatar/joe.jpg" />
                <span>Joe</span>
              </div> */}
            </div>
          </div>
          <div className="content">
            <div className="chat-window-current-title">
              <img src={this.state.currentChat.imagePath} />
              <span>{this.state.currentChat.name}</span>
            </div>
            <CreateGroupForm
              createFormOpen={this.state.createFormOpen}
              handleCreateFormClose={this.handleCreateFormClose}
              handleCreateFormSubmit={this.handleCreateFormSubmit}
            />
            {this.state.addButtonClick && (
              <div className="chat-groups-operations">
                <span onClick={this.handleJoinClick}>Join a Group Chat</span>
                <span onClick={this.handleCreateClick}>
                  Create a Group Chat
                </span>
                <button
                  onClick={() => this.setState({ addButtonClick: false })}
                >
                  Cancel
                </button>
              </div>
            )}
            <div className="chat-message-wrapper" ref={this.messagesRef}>
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
