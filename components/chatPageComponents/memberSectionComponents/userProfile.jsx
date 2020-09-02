const UserProfile = ({
  imagePath,
  name,
  handleCloseClick,
  handleDeleteFriend,
  memberSectionOpen,
}) => {
  return (
    <div
      className={
        memberSectionOpen
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
};

export default UserProfile;
