const MemberProfile = ({
  imagePath,
  name,
  handleCloseClick,
  handleAddFriend,
  handleChat,
  isAdmin,
  memberStatus,
}) => {
  return (
    <div className="group-form group-form-open member-profile">
      <img src={imagePath} />
      <div className="member-position">{isAdmin ? "Admin" : "Member"}</div>
      <div
        className={
          isAdmin ? "member-header member-admin" : "member-header member-member"
        }
      />
      <h3>{name}</h3>
      <div className="join-group-form-buttons">
        <button className="close-button" onClick={handleCloseClick}>
          Close
        </button>
        {memberStatus === "isFriend" && (
          <button
            className="continue-button"
            onClick={() => handleChat(name, imagePath)}
          >
            Chat
          </button>
        )}
        {memberStatus === "isNotFriend" && (
          <button
            className="continue-button"
            onClick={() => handleAddFriend(name, imagePath)}
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
};

export default MemberProfile;
