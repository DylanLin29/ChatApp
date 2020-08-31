import { Component } from "react";
import _ from "lodash";
import GroupChatOperations from "./chatPageComponents/groupChatOperations";
import CreateGroupForm from "./chatPageComponents/createGroupForm";
import SearchArea from "./chatPageComponents/searchArea";
import FriendsList from "./chatPageComponents/friendsList";
import MembersList from "./chatPageComponents/membersList";
import MessageSection from "./chatPageComponents/messageSection";
import Background from "./chatPageComponents/background";
import ChatInputArea from "./chatPageComponents/chatInputArea";
import ChatHeader from "./chatPageComponents/chatHeader";
import SearchResult from "./chatPageComponents/searchResult";
import axios from "axios";
const links = require("../config/links");

class ChatSection extends Component {
  constructor(props) {
    super(props);

    this.messagesRef = React.createRef();
    this.searchRef = React.createRef();

    this.state = {
      searchGroup: {
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
        isFriendChat: false,
        status: false,
        groupAdmin: "",
      },
      addButtonClick: false,
      createGroupFormOpen: false,
      createGroupErrorMessage: "",
      joinGroupFormOpen: false,
      profileOpen: false,
      searchNotFound: false,
      membersListOpen: false,
    };
  }

  async componentDidMount() {
    // listen to the server
    this.props.socket.on("PRIVATE_MESSAGE", (message) => {
      let response = this.state.response;
      response.push(message);
      this.setState({ response });
      this.messagesRef.current.scrollTop = this.messagesRef.current?.scrollHeight;
    });

    this.props.socket.on("MESSAGE", (data) => {
      let response = this.state.response;
      response.push(data);
      this.setState({ response });
      // set the messages always view at the bottom
      this.messagesRef.current.scrollTop = this.messagesRef.current?.scrollHeight;
    });

    this.props.socket.on("GROUP_NOTIFICATION", (message) => {
      let response = this.state.response;
      response.push(message);
      this.setState({ response });
      // this.messagesRef.current.scrollTop = this.messagesRef.current?.scrollHeight;
    });

    if (this.state.currentChat.name) {
      this.messagesRef.current.scrollTop = this.messagesRef.current.scrollHeight;
    }

    this.props.socket.on("TYPING", (typingUser) => {
      this.setState({ typingUser });
    });

    this.props.socket.on("NOT_TYPING", (typingUser) => {
      if (this.state.typingUser === typingUser) {
        this.setState({ typingUser: "" });
      }
    });

    this.props.socket.on("MEMBERS_LIST", (membersData) => {
      const currentChat = { ...this.state.currentChat };
      currentChat.members = membersData.members;
      this.setState({ currentChat });
    });

    this.props.socket.on("USER_STATUS", ({ userName, status }) => {
      if (userName === this.state.currentChat.name) {
        const currentChat = { ...this.state.currentChat };
        currentChat.status = status;
        this.setState({ currentChat });
      }
    });
  }

  searchSubmit = async (name) => {
    const groupResult = await axios.get(links.groups, {
      params: {
        groupName: name,
      },
    });
    if (groupResult.data.success) {
      this.setState({
        searchGroup: groupResult.data.group,
        joinGroupFormOpen: true,
      });
    }
    const userResult = await axios.get(links.users, {
      params: {
        name: name,
      },
    });
    if (userResult.data.user) {
      this.setState({ profileOpen: true, searchUser: userResult.data.user });
    }

    if (!userResult.data.user && !groupResult.data.success) {
      this.setState({ searchNotFound: true });
    }
  };

  handleOpenGroupChat = async (name, imagePath) => {
    const result = await axios.get(`${links.groups}/members`, {
      params: { groupName: name },
    });
    if (
      this.state.currentChat.name !== "" &&
      name !== this.state.currentChat.name
    ) {
      this.props.socket.emit("leaveRoom", this.state.currentChat.name);
    }
    const responseResult = await axios.get(links.messages, {
      params: { groupName: name },
    });
    if (this.state.currentChat.name !== name) {
      this.props.socket.emit("joinRoom", name);
    }
    this.setState({
      currentChat: {
        name: name,
        imagePath: imagePath,
        members: result.data.userList,
        isFriendChat: false,
        groupAdmin: result.data.groupAdmin,
      },
      response: responseResult.data.response,
      membersListOpen: false,
    });
  };

  handleOpenFriendChat = async (name, imagePath) => {
    const responseResult = await axios.get(`${links.messages}/privateMessage`, {
      params: { friendName: name, userName: this.props.user.name },
    });
    this.setState({
      currentChat: {
        name: name,
        imagePath: imagePath,
        members: [{ name: name, imagePath: imagePath }],
        isFriendChat: true,
      },
      response: responseResult.data.responses,
      membersListOpen: false,
    });
    this.props.socket.emit("USER_STATUS", name);
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
        groupName: name,
        imagePath: imagePath,
        userName: this.props.user.name,
        userId: this.props.user._id,
      });
      const user = { ...this.props.user };
      user.groups = result.data.groups;
      this.props.handleUserUpdate(user);
      this.setState({ createGroupFormOpen: false });
    } catch (err) {
      this.setState({ createGroupErrorMessage: "Group Chat Already Exists" });
    }
  };

  handleJoinFormClose = () => {
    this.setState({
      joinGroupFormOpen: false,
    });
  };

  handleJoinFormSubmit = () => {
    this.props.handleJoinFormDoSubmit(this.state.searchGroup.name);
    this.props.socket.emit("JOIN_GROUPCHAT", {
      userName: this.props.user.name,
      groupName: this.state.searchGroup.name,
    });
    this.setState({ joinGroupFormOpen: false });
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
    this.props.socket.emit("leaveRoom", this.state.currentChat.name);
    this.setState({ response: [] });
    const result = await axios.post(`${links.groups}/leave`, {
      groupName: currentChat.name,
      userName: this.props.user.name,
    });
    this.props.socket.emit("LEAVE_GROUPCHAT", {
      userName: this.props.user.name,
      groupName: this.state.searchGroup.name,
    });
    currentChat.name = "";
    currentChat.imagePath = "";
    currentChat.members = this.state.currentChat.members.filter(
      (member) => member.name !== this.props.user.name
    );
    const user = { ...this.props.user };
    user.groups = result.data.groups;
    this.props.handleUserUpdate(user);
    this.setState({ currentChat, membersListOpen: false });
  };

  handleDeleteClick = async () => {
    const currentChat = { ...this.stat };
  };

  handleSearchNotFoundChange = () => {
    this.setState({ searchNotFound: false });
  };

  handleResetError = () => {
    this.setState({ createGroupErrorMessage: "" });
  };

  clearCurrentChat = () => {
    const currentChat = {
      name: "",
      imagePath: "",
      members: [],
      isFriendChat: false,
    };
    this.setState({ currentChat });
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
              groups={this.props.user.groups}
              friends={this.props.user.friends}
              handleOpenGroupChat={this.handleOpenGroupChat}
              handleOpenFriendChat={this.handleOpenFriendChat}
            />
          </div>
          <div className="content">
            <ChatHeader
              currentChat={this.state.currentChat}
              handleTitleInfoClick={this.handleTitleInfoClick}
              clearCurrentChat={this.clearCurrentChat}
            />
            <div className="chat-section-below-header">
              <MembersList
                currentChat={this.state.currentChat}
                membersListOpen={this.state.membersListOpen}
                handleLeaveClick={this.handleLeaveClick}
                handleCloseClick={this.handleTitleInfoClick}
                handleUserUpdate={this.props.handleUserUpdate}
                clearCurrentChat={this.clearCurrentChat}
                user={this.props.user}
                socket={this.props.socket}
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
                searchGroup={this.state.searchGroup}
                handleJoinFormSubmit={this.handleJoinFormSubmit}
                handleJoinFormClose={this.handleJoinFormClose}
                handleProfileClose={this.handleProfileClose}
                handleOpenFriendChat={this.handleOpenFriendChat}
                handleOpenGroupChat={this.handleOpenGroupChat}
                searchUser={this.state.searchUser}
                user={this.props.user}
                profileOpen={this.state.profileOpen}
                socket={this.props.socket}
              />
              {this.state.currentChat.name && (
                <MessageSection
                  messagesRef={this.messagesRef}
                  response={this.state.response}
                  username={this.props.user.name}
                  friendname={this.state.currentChat.name}
                  userImagePath={this.props.user.imagePath}
                  friendImagePath={this.state.currentChat.imagePath}
                  isFriendChat={this.state.currentChat.isFriendChat}
                />
              )}
              {this.state.currentChat.name === "" && (
                <Background hasFriends={this.props.user.friends.length !== 0} />
              )}
              {this.state.currentChat.name && (
                <ChatInputArea
                  handleChatInputEnter={this.handleChatInputEnter}
                  user={this.props.user}
                  typingUser={this.state.typingUser}
                  currentChatName={this.state.currentChat.name}
                  socket={this.props.socket}
                  isFriendChat={this.state.currentChat.isFriendChat}
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
