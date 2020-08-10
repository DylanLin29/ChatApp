import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
const ChatHeader = ({ name, imagePath, handleTitleInfoClick }) => {
  return (
    <div className="chat-window-current-title">
      <img src={imagePath} />
      <span>{name}</span>
      {name && (
        <FontAwesomeIcon icon={faEllipsisH} onClick={handleTitleInfoClick} />
      )}
    </div>
  );
};

export default ChatHeader;
