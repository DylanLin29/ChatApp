import { Component } from "react";
import io from "socket.io-client";
import _ from "lodash";
import GroupChatOperations from "./chatPageComponents/groupChatOperations";
import CreateGroupForm from "./chatPageComponents/createGroupForm";
import SearchArea from "./chatPageComponents/searchArea";
import FriendsList from "./chatPageComponents/friendsList";
import MembersList from "./chatPageComponents/membersList";
import MessageSection from "./chatPageComponents/messageSection";
import ChatInputArea from "./chatPageComponents/chatInputArea";
import ChatHeader from "./chatPageComponents/chatHeader";
import SearchResult from "./chatPageComponents/searchResult";
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
        groups: [],
        _id: "",
      },
      group: {
        name: "",
        imagePath: "",
        size: "",
      },
      searchUser: {
        name: "",
        imagePath: "",
      },
      response: [],
      typingUser: "",
      currentChat: {
        name: "",
        imagePath: "",
        members: [],
      },
      addButtonClick: false,
      createGroupFormOpen: false,
      createGroupErrorMessage: "",
      joinGroupFormOpen: false,
      profileOpen: false,
      searchNotFound: false,
      membersListOpen: false,
      userJoined: false,
    };
  }

  async componentDidMount() {
    // get user info
    const userInfo = await axios.get(links.auth, {
      withCredentials: true,
    });

    this.setState({ user: userInfo.data });

    this.socket = io(ENDPOINT);

    // listen to the server
    this.socket.on("MESSAGE", (data) => {
      let response = this.state.response;
      response.push(data);
      this.setState({ response });
      // set the messages always view at the bottom
      this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight;
    });

    this.socket.on("GROUP_NOTIFICATION", (message) => {
      let response = this.state.response;
      response.push(message);
      this.setState({ response });
      this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight;
    });

    this.socket.on("TYPING", (typingUser) => {
      this.setState({ typingUser });
    });

    this.socket.on("NOT_TYPING", (typingUser) => {
      if (this.state.typingUser === typingUser) {
        this.setState({ typingUser: "" });
      }
    });

    this.socket.on("MEMBERS_LIST", (membersData) => {
      const currentChat = { ...this.state.currentChat };
      currentChat.members = membersData.members;
      this.setState({ currentChat });
    });
  }

  searchSubmit = async (groupName) => {
    const groupResult = await axios.get(links.groups, {
      params: {
        groupName: groupName,
        userId: this.state.user._id,
      },
    });
    if (groupResult.data.success) {
      this.setState({
        group: groupResult.data.group,
        joinGroupFormOpen: true,
        userJoined: groupResult.data.joined,
      });
    }
    const userResult = await axios.get(links.users, {
      params: {
        name: groupName,
      },
    });
    if (userResult.data.user) {
      this.setState({ profileOpen: true, searchUser: userResult.data.user });
    }

    if (!userResult.data.user && !groupResult.data.success) {
      this.setState({ searchNotFound: true });
    }
  };

  handleNoTyping = () => {
    this.socket.emit("NOT_TYPING", this.props.user.name);
  };

  handleChatInputEnter = async (event, message) => {
    if (event.key !== "Enter") {
      this.socket.emit("TYPING", {
        name: this.props.user.name,
        room: this.state.currentChat.name,
      });
      clearTimeout(timeout);
      timeout = setTimeout(this.handleNoTyping, 5000);
    } else {
      const removeSpaces = message.content.replace(/\s/g, "");
      if (event.key === "Enter" && removeSpaces) {
        this.socket.emit("MESSAGE", {
          message: message,
          room: this.state.currentChat.name,
        });
        clearTimeout(timeout);
        // save message to database
        await axios.post(links.messages, {
          username: message.id,
          imagePath: message.imagePath,
          content: message.content,
          groupName: this.state.currentChat.name,
        });
        this.socket.emit("NOT_TYPING", this.props.user.name);
      }
    }
  };

  handleOpenChat = async (name, imagePath) => {
    const result = await axios.get(`${links.groups}/members`, {
      params: { groupName: name },
    });
    if (
      this.state.currentChat.name !== "" &&
      name !== this.state.currentChat.name
    ) {
      this.socket.emit("leaveRoom", this.state.currentChat.name);
    }
    const responseResult = await axios.get(links.messages, {
      params: { groupName: name },
    });
    if (this.state.currentChat.name !== name) {
      this.socket.emit("joinRoom", name);
    }
    this.setState({
      currentChat: {
        name: name,
        imagePath: imagePath,
        members: result.data.userList,
      },
      response: responseResult.data.response,
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
    this.setState({ createGroupFormOpen: false, createGroupErrorMessage: "" });
  };

  handleCreateFormSubmit = async (name, imagePath) => {
    try {
      const result = await axios.post(links.groups, {
        name: name,
        imagePath: imagePath,
        _id: this.state.user._id,
      });
      const user = { ...this.state.user };
      user.groups = result.data.groups;
      this.setState({ createGroupFormOpen: false, user });
    } catch (err) {
      this.setState({ createGroupErrorMessage: "Group Chat Already Exists" });
    }
  };

  handleJoinFormClose = () => {
    this.setState({
      joinGroupFormOpen: false,
    });
  };

  handleJoinFormOpen = (groupName, groupImagePath) => {
    this.setState({ joinGroupFormOpen: false });
    this.handleOpenChat(groupName, groupImagePath);
  };

  handleJoinFormSubmit = () => {
    this.props.handleJoinFormDoSubmit(this.state.group.name);
    const user = { ...this.state.user };
    user.groups.push(this.state.group);
    this.socket.emit("JOIN_GROUPCHAT", {
      userName: this.props.user.name,
      groupName: this.state.group.name,
    });
    this.setState({ joinGroupFormOpen: false, user });
  };

  handleProfileClose = () => {
    this.setState({
      profileOpen: false,
    });
  };

  handleTitleInfoClick = () => {
    const membersListStatus = !this.state.membersListOpen;
    this.setState({ membersListOpen: membersListStatus });
  };

  handleLeaveClick = async () => {
    const currentChat = { ...this.state.currentChat };
    this.socket.emit("leaveRoom", this.state.currentChat.name);
    this.setState({ response: [] });
    const result = await axios.post(`${links.groups}/leave`, {
      groupName: currentChat.name,
      userName: this.state.user.name,
    });
    this.socket.emit("LEAVE_GROUPCHAT", {
      userName: this.state.user.name,
      groupName: this.state.group.name,
    });
    currentChat.name = "";
    currentChat.imagePath = "";
    currentChat.members = this.state.currentChat.members.filter(
      (member) => member.name !== this.state.user.name
    );
    this.setState({ currentChat, membersListOpen: false });
    this.setState({ user: { groups: result.data.groups } });
  };

  handleSearchNotFoundChange = () => {
    this.setState({ searchNotFound: false });
  };

  handleResetError = () => {
    this.setState({ createGroupErrorMessage: "" });
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
              searchNotFound={this.state.searchNotFound}
              handleSearchNotFoundChange={this.handleSearchNotFoundChange}
            />
            <FriendsList
              groups={this.state.user.groups}
              handleOpenChat={this.handleOpenChat}
            />
          </div>
          <div className="content">
            <ChatHeader
              name={this.state.currentChat.name}
              imagePath={this.state.currentChat.imagePath}
              handleTitleInfoClick={this.handleTitleInfoClick}
            />
            <div className="chat-section-below-header">
              <MembersList
                groups={this.state.currentChat.members}
                membersListOpen={this.state.membersListOpen}
                handleLeaveClick={this.handleLeaveClick}
              />
              <CreateGroupForm
                createGroupFormOpen={this.state.createGroupFormOpen}
                handleCreateFormClose={this.handleCreateFormClose}
                handleCreateFormSubmit={this.handleCreateFormSubmit}
                createGroupErrorMessage={this.state.createGroupErrorMessage}
                handleResetError={this.handleResetError}
              />
              <GroupChatOperations
                addButtonClick={this.state.addButtonClick}
                handleJoinClick={this.handleJoinClick}
                handleCreateClick={this.handleCreateClick}
                handleCancelClick={() => {
                  this.setState({ addButtonClick: false });
                }}
              />
              <SearchResult
                joinGroupFormOpen={this.state.joinGroupFormOpen}
                group={this.state.group}
                handleJoinFormSubmit={this.handleJoinFormSubmit}
                handleJoinFormClose={this.handleJoinFormClose}
                handleJoinFormOpen={this.handleJoinFormOpen}
                handleProfileClose={this.handleProfileClose}
                userJoined={this.state.userJoined}
                searchUser={this.state.searchUser}
                userName={this.state.user.name}
                profileOpen={this.state.profileOpen}
              />
              <MessageSection
                messagesRef={this.messagesRef}
                response={this.state.response}
                username={this.state.user.name}
                userImagePath={this.state.user.imagePath}
              />
              {this.state.currentChat.name && (
                <ChatInputArea
                  handleChatInputEnter={this.handleChatInputEnter}
                  user={this.state.user}
                  typingUser={this.state.typingUser}
                  groupName={this.state.currentChat.name}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatSection;
