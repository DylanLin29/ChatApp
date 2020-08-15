import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
const ProfileForm = ({ user, profileOpen, handleProfileClose, groupFound }) => {
  return (
    <div
      className={
        groupFound ? "join-group-form" : "join-group-form move-profile-left"
      }
    >
      <div
        className={profileOpen ? "group-form group-form-open" : "group-form"}
      >
        <img src={user.imagePath} />
        <h3>{user.name}</h3>
        <div>
          <FontAwesomeIcon icon={faUserFriends} style={{ opacity: 0 }} />
        </div>
        <div className="join-group-form-buttons">
          <button className="cancel-button" onClick={handleProfileClose}>
            Close
          </button>
          <button className="continue-button">Add</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
