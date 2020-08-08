import { Component } from "react";
import io from "socket.io-client";
import _ from "lodash";
import GroupChatOperations from "./chatPageComponents/groupChatOperations";
import CreateGroupForm from "./chatPageComponents/createGroupForm";
import JoinGroupForm from "./chatPageComponents/joinGroupForm";
import SearchArea from "./chatPageComponents/searchArea";
import FriendsList from "./chatPageComponents/friendsList";
import MessageSection from "./chatPageComponents/messageSection";
import ChatInputArea from "./chatPageComponents/chatInputArea";
import axios from "axios";
const links = require("../config/links");
const ENDPOINT = links.connection;
var timeout = undefined;

class ChatSection extends Component {
  constructor(props) {
    super(props);

    this.messagesRef = React.createRef();
    this.searchRef = React.createRef();

    this.state = {
      user: {
        name: "",
        imagePath: "",
      },
      group: {
        name: "",
        imagePath: "",
        size: "",
      },
      response: [],
      typingUser: "",
      currentChat: {
        name: "",
        imagePath: "",
      },
      addButtonClick: false,
      createGroupFormOpen: false,
      joinGroupFormOpen: false,
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

  searchSubmit = async (groupName) => {
    try {
      const result = await axios.get(links.groups, {
        params: {
          groupName: groupName,
        },
      });
      this.setState({ group: result.data.group, joinGroupFormOpen: true });
      console.log("Result", result);
    } catch (err) {
      console.log(err);
    }
  };

  handleNoTyping = () => {
    this.socket.emit("NOT_TYPING", this.props.user.name);
  };

  handleChatInputEnter = (event, message) => {
    if (event.key !== "Enter") {
      this.socket.emit("TYPING", this.props.user.name);
      clearTimeout(timeout);
      timeout = setTimeout(this.handleNoTyping, 5000);
    } else {
      const removeSpaces = message.content.replace(/\s/g, "");
      if (event.key === "Enter" && removeSpaces) {
        this.socket.emit("SEND_MESSAGE", message);
        clearTimeout(timeout);
        this.socket.emit("NOT_TYPING", this.props.user.name);
      }
    }
  };

  handleOpenChat = (name, imagePath) => {
    this.setState({
      currentChat: { name: name, imagePath: imagePath },
    });
  };

  handleAddClick = () => {
    this.setState({ addButtonClick: true, createGroupFormOpen: false });
  };

  handleJoinClick = () => {
    this.setState({ addButtonClick: false });
    this.searchRef.current.focus();
  };

  handleCreateClick = () => {
    this.setState({ createGroupFormOpen: true, addButtonClick: false });
  };

  handleCreateFormClose = () => {
    this.setState({ createGroupFormOpen: false });
  };

  handleCreateFormSubmit = async (name, imagePath) => {
    await this.props.handleCreateFormDoSubmit(name, imagePath);
    this.setState({ createGroupFormOpen: false });
  };

  handleJoinFormClose = () => {
    this.setState({ joinGroupFormOpen: false });
  };

  handleJoinFormSubmit = () => {
    this.props.handleJoinFormDoSubmit(this.state.group.name);
    this.setState({ joinGroupFormOpen: false });
  };

  render() {
    return (
      <div>
        <div className="chat-window">
          <div className="friends-list-container">
            <SearchArea
              searchRef={this.searchRef}
              handleAddClick={this.handleAddClick}
              searchSubmit={this.searchSubmit}
            />
            <FriendsList
              groups={this.props.user.groups}
              handleOpenChat={this.handleOpenChat}
            />
          </div>
          <div className="content">
            <div className="chat-window-current-title">
              <img src={this.state.currentChat.imagePath} />
              <span>{this.state.currentChat.name}</span>
            </div>
            <CreateGroupForm
              createGroupFormOpen={this.state.createGroupFormOpen}
              handleCreateFormClose={this.handleCreateFormClose}
              handleCreateFormSubmit={this.handleCreateFormSubmit}
            />
            <JoinGroupForm
              joinGroupFormOpen={this.state.joinGroupFormOpen}
              group={this.state.group}
              handleJoinFormSubmit={this.handleJoinFormSubmit}
              handleJoinFormClose={this.handleJoinFormClose}
            />
            <GroupChatOperations
              addButtonClick={this.state.addButtonClick}
              handleJoinClick={this.handleJoinClick}
              handleCreateClick={this.handleCreateClick}
              handleCancelClick={() => {
                this.setState({ addButtonClick: false });
              }}
            />
            <MessageSection
              messagesRef={this.messagesRef}
              response={this.state.response}
              username={this.props.user.name}
              userImagePath={this.props.user.imagePath}
            />
            <ChatInputArea
              handleChatInputEnter={this.handleChatInputEnter}
              user={this.props.user}
              typingUser={this.state.typingUser}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ChatSection;
