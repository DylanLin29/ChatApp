import axios from "axios";
const links = require("../../config/links");

const MembersList = ({
  currentChat,
  membersListOpen,
  handleLeaveClick,
  handleCloseClick,
  handleUserUpdate,
  clearCurrentChat,
  user,
  socket,
}) => {
  const { imagePath, members, isFriendChat, groupAdmin } = currentChat;

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
      await axios.post(`${links.users}/notifications`, {
        type: "delete group",
        groupName: currentChat.name,
        adminName: groupAdmin,
        userName: name,
      });
    });
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
        <div className="group-form group-form-open">
          <img src={imagePath} />
          <h3>{name}</h3>
          <div className="join-group-form-buttons">
            <button className="close-button" onClick={handleCloseClick}>
              Close
            </button>
            <button className="cancel-button" onClick={handleDeleteFriend}>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={
          membersListOpen ? "members-list members-list-open" : "members-list"
        }
      >
        {members.map(({ name, imagePath }, index) => {
          return (
            <div className="member-info" key={`member-info-${index}`}>
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
    );
  }
};

export default MembersList;
