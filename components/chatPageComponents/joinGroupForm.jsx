import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";

const JoinGroupForm = ({
  joinGroupFormOpen,
  searchGroup,
  handleJoinFormSubmit,
  handleJoinFormClose,
  handleOpenGroupChat,
  user,
}) => {
  const handleChatOpen = () => {
    handleJoinFormClose();
    handleOpenGroupChat(searchGroup.name, searchGroup.imagePath);
  };

  const alreadyJoinGroup = () => {
    for (let i = 0; i < user.groups.length; i++) {
      if (searchGroup.name === user.groups[i].name) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="join-group-form">
      <div
        className={
          joinGroupFormOpen ? "group-form group-form-open" : "group-form"
        }
      >
        <img src={searchGroup.imagePath} />
        <h3>{searchGroup.name}</h3>
        <div>
          <FontAwesomeIcon icon={faUserFriends} />{" "}
          <span>{searchGroup.size}</span>
        </div>
        {alreadyJoinGroup() ? (
          <div className="join-group-form-buttons">
            <button onClick={handleJoinFormClose} className="cancel-button">
              Close
            </button>
            <button
              id={"join-group-form-join"}
              onClick={handleChatOpen}
              className="continue-button"
            >
              Open
            </button>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default JoinGroupForm;
