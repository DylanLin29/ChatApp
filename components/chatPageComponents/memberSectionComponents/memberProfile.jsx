import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMinus } from "@fortawesome/free-solid-svg-icons";
const MemberProfile = ({
  imagePath,
  name,
  handleCloseClick,
  handleAddFriend,
  handleDeleteMember,
  handleChat,
  isAdmin,
  currentUserAdmin,
  memberStatus,
  memberInfoOpen,
  memberSectionOpen,
}) => {
  return (
    <div
      className={
        memberInfoOpen && memberSectionOpen
          ? "friend-chat-profile join-group-form member-profile-open"
          : "friend-chat-profile join-group-form"
      }
    >
      <div className="group-form group-form-open member-profile">
        <img src={imagePath} />
        <div className="member-position">{isAdmin ? "Admin" : "Member"}</div>
        {currentUserAdmin && memberStatus !== "isSelf" && (
          <FontAwesomeIcon
            icon={faUserMinus}
            onClick={() => handleDeleteMember(name)}
          />
        )}
        <div
          className={
            isAdmin
              ? "member-header member-admin"
              : "member-header member-member"
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
    </div>
  );
};

export default MemberProfile;
