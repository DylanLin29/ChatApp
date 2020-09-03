import axios from "axios";
import { useState } from "react";
import UserProfile from "./memberSectionComponents/userProfile";
import MemberProfile from "./memberSectionComponents/memberProfile";
import MembersList from "./memberSectionComponents/membersList";
const links = require("../../config/links");

const MemberSection = ({
  currentChat,
  memberSectionOpen,
  handleLeaveClick,
  handleCloseClick,
  handleUserUpdate,
  handleCurrentChatUpdate,
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

  const handleDeleteMember = async (name) => {
    socket.emit("DELETE_MEMBER", {
      groupName: currentChat.name,
      userName: name,
    });
    handleMemberInfoClose();
    const updateCurrentChat = { ...currentChat };
    const updateMembers = members.filter((member) => member.name !== name);
    updateCurrentChat.members = updateMembers;
    handleCurrentChatUpdate(updateCurrentChat);

    await axios.post(`${links.users}/notifications`, {
      type: "delete member",
      groupName: currentChat.name,
      userName: name,
    });

    await axios.post(`${links.groups}/leave`, {
      groupName: currentChat.name,
      userName: name,
    });
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
      <UserProfile
        name={currentChat.name}
        imagePath={imagePath}
        memberSectionOpen={memberSectionOpen}
        handleCloseClick={handleCloseClick}
        handleDeleteFriend={handleDeleteFriend}
      />
    );
  } else {
    return (
      <div>
        <MembersList
          memberSectionOpen={memberSectionOpen}
          memberInfoOpen={memberInfoOpen}
          members={members}
          user={user}
          memberName={memberName}
          groupAdmin={groupAdmin}
          handleMemberInfoClick={handleMemberInfoClick}
          handleDeleteGroup={handleDeleteGroup}
          handleLeaveClick={handleLeaveClick}
        />
        <MemberProfile
          name={memberName}
          imagePath={memberImagePath}
          handleCloseClick={handleMemberInfoClose}
          handleAddFriend={handleAddFriend}
          handleDeleteMember={handleDeleteMember}
          handleChat={handleChat}
          isAdmin={memberName === groupAdmin}
          currentUserAdmin={user.name === groupAdmin}
          memberStatus={getMemberStatus(memberName)}
          memberInfoOpen={memberInfoOpen}
          memberSectionOpen={memberSectionOpen}
        />
      </div>
    );
  }
};

export default MemberSection;
