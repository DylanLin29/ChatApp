import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";

const JoinGroupForm = ({
  joinGroupFormOpen,
  group,
  handleJoinFormSubmit,
  handleJoinFormClose,
}) => {
  return (
    <div className="join-group-form">
      <div
        className={
          joinGroupFormOpen ? "group-form group-form-open" : "group-form"
        }
      >
        <img src={group.imagePath} />
        <h3>{group.name}</h3>
        <div>
          <FontAwesomeIcon icon={faUserFriends} /> <span>{group.size}</span>
        </div>
        <div className="join-group-form-buttons">
          <button onClick={handleJoinFormClose} className="cancel-button">
            Cancel
          </button>
          <button
            id={"join-group-form-join"}
            onClick={handleJoinFormSubmit}
            className="continue-button"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupForm;
