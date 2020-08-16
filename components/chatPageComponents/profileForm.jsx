import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import links from "../../config/links";
import axios from "axios";
const ProfileForm = ({
  searchUser,
  profileOpen,
  handleProfileClose,
  groupFound,
  userName,
}) => {
  const handleAddClick = () => {
    axios.post(`${links.users}/friendRequest`, {
      friendName: searchUser.name,
      userName: userName,
    });
    handleProfileClose();
  };
  return (
    <div
      className={
        groupFound ? "join-group-form" : "join-group-form move-profile-left"
      }
    >
      <div
        className={profileOpen ? "group-form group-form-open" : "group-form"}
      >
        <img src={searchUser.imagePath} />
        <h3>{searchUser.name}</h3>
        <div>
          <FontAwesomeIcon icon={faUserFriends} style={{ opacity: 0 }} />
        </div>
        <div className="join-group-form-buttons">
          <button className="cancel-button" onClick={handleProfileClose}>
            Close
          </button>
          <button className="continue-button" onClick={handleAddClick}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
