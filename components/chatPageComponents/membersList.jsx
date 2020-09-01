import axios from "axios";
import { useState } from "react";
import UserProfile from "./membersListComponents/userProfile";
import MemberProfile from "./membersListComponents/memberProfile";
const links = require("../../config/links");

const MembersList = ({
  currentChat,
  membersListOpen,
  handleLeaveClick,
  handleCloseClick,
  handleUserUpdate,
  handleOpenFriendChat,
  clearCurrentChat,
  user,
  socket,
}) => {
  const { imagePath, members, isFriendChat, groupAdmin } = currentChat;
  const [memberInfoOpen, setMemberInfoOpen] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberImagePath, setMemberImagePath] = useState("");

  const handleDeleteFriend = async () => {
    await axios.post(`${links.users}/friends/delete`, {
      userName: user.name,
      friendName: currentChat.name,
    });
    await axios.post(`${links.users}/notifications`, {
      type: "delete friend",
      friendName: user.name,
      userName: currentChat.name,
    });
    handleCloseClick();
    const friends = user.friends.filter(
      (friend) => friend.name !== currentChat.name
    );
    const updateUser = { ...user };
    updateUser.friends = friends;
    handleUserUpdate(updateUser);
    clearCurrentChat();
    // Delete Friend on Friend Side
    socket.emit("DELETE_FRIEND", {
      userName: currentChat.name,
      friendName: user.name,
    });
  };

  // Admin can delete group
  const handleDeleteGroup = async () => {
    handleCloseClick();
    setTimeout(() => clearCurrentChat(), 350);
    const result = await axios.post(`${links.groups}/delete`, {
      groupName: currentChat.name,
      userName: user.name,
    });
    socket.emit("DELETE_GROUP", {
      adminName: groupAdmin,
      groupName: currentChat.name,
      userList: result.data.userList,
    });
    members.map(async ({ name }) => {
      if (name !== groupAdmin) {
        await axios.post(`${links.users}/notifications`, {
          type: "delete group",
          groupName: currentChat.name,
          adminName: groupAdmin,
          userName: name,
        });
      }
    });
  };

  const handleMemberInfoClick = (name, imagePath) => {
    if (memberName === "" || !memberInfoOpen) {
      setMemberInfoOpen(true);
      setMemberName(name);
      setMemberImagePath(imagePath);
    } else if (name === memberName) {
      setMemberInfoOpen(false);
    } else {
      setMemberName(name);
      setMemberImagePath(imagePath);
    }
  };

  const handleMemberInfoClose = () => {
    setMemberInfoOpen(false);
  };

  const handleAddFriend = (name) => {
    socket.emit("FRIEND_REQUEST", {
      userName: user.name,
      friendName: name,
    });
    axios.post(`${links.users}/friendRequest`, {
      friendName: name,
      userName: user.name,
    });
    setMemberInfoOpen(false);
  };

  const handleChat = (name, imagePath) => {
    setMemberInfoOpen(false);
    handleCloseClick();
    handleOpenFriendChat(name, imagePath);
  };

  const getMemberStatus = (name) => {
    if (name === user.name) {
      return "isSelf";
    }
    for (let i = 0; i < user.friends.length; i++) {
      if (user.friends[i].name === name) {
        return "isFriend";
      }
    }
    return "isNotFriend";
  };

  if (isFriendChat) {
    return (
      <div
        className={
          membersListOpen
            ? "friend-chat-profile join-group-form friend-chat-profile-open"
            : "friend-chat-profile join-group-form"
        }
      >
        <UserProfile
          name={currentChat.name}
          imagePath={imagePath}
          handleCloseClick={handleMemberInfoClick}
          handleDeleteFriend={handleDeleteFriend}
        />
      </div>
    );
  } else {
    return (
      <div>
        <div
          className={
            membersListOpen ? "members-list members-list-open" : "members-list"
          }
        >
          {members.map(({ name, imagePath }, index) => {
            return (
              <div
                className={
                  name === memberName && memberInfoOpen
                    ? "member-info member-info-active"
                    : "member-info"
                }
                key={`member-info-${index}`}
                onClick={() => handleMemberInfoClick(name, imagePath)}
              >
                <img src={imagePath} />
                <span>{name}</span>
              </div>
            );
          })}
          {user.name === groupAdmin ? (
            <div className="group-options">
              <div onClick={handleDeleteGroup}>Delete</div>
              <div onClick={handleLeaveClick}>Leave</div>
            </div>
          ) : (
            <div className="group-options">
              <div onClick={handleLeaveClick}>Leave</div>
            </div>
          )}
        </div>
        <div
          className={
            memberInfoOpen
              ? "friend-chat-profile join-group-form member-profile-open"
              : "friend-chat-profile join-group-form"
          }
        >
          <MemberProfile
            name={memberName}
            imagePath={memberImagePath}
            handleCloseClick={handleMemberInfoClose}
            handleAddFriend={handleAddFriend}
            handleChat={handleChat}
            isAdmin={memberName === groupAdmin}
            memberStatus={getMemberStatus(memberName)}
          />
        </div>
      </div>
    );
  }
};

export default MembersList;
