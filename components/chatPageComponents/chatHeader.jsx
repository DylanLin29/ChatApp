import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
const ChatHeader = ({
  name,
  imagePath,
  handleTitleInfoClick,
  clearCurrentChat,
}) => {
  return (
    <div className="chat-window-current-title">
      {name && (
        <FontAwesomeIcon
          icon={faChevronLeft}
          size="lg"
          onClick={clearCurrentChat}
        />
      )}
      <img src={imagePath} />
      <span>{name}</span>
      {name && (
        <FontAwesomeIcon
          icon={faEllipsisH}
          onClick={handleTitleInfoClick}
          size="lg"
        />
      )}
    </div>
  );
};

export default ChatHeader;
