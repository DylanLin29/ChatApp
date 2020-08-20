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
}) => {
  const { name, imagePath, members, isFriendChat } = currentChat;

  const handleDeleteFriend = async () => {
    await axios.post(`${links.users}/friends/delete`, {
      userName: user.name,
      friendName: currentChat.name,
    });
    handleCloseClick();
    const friends = user.friends.filter(
      (friend) => friend.name !== currentChat.name
    );
    const updateUser = { ...user };
    updateUser.friends = friends;
    handleUserUpdate(updateUser);
    clearCurrentChat();
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
        <div className="group-leave" onClick={handleLeaveClick}>
          Leave
        </div>
      </div>
    );
  }
};

export default MembersList;
