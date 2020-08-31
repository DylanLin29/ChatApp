import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisH,
  faChevronLeft,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
const ChatHeader = ({
  currentChat,
  handleTitleInfoClick,
  clearCurrentChat,
}) => {
  const { name, imagePath, isFriendChat, status } = currentChat;
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
      <div className="header-info">
        <span>{name}</span>
        {isFriendChat && (
          <div>
            <span
              className={
                status
                  ? "status-dot status-online"
                  : "status-dot status-offline"
              }
            />
            <span className="status-text">{status ? "Online" : "Offline"}</span>
          </div>
        )}
      </div>
      {name &&
        (isFriendChat ? (
          <FontAwesomeIcon
            icon={faInfoCircle}
            onClick={handleTitleInfoClick}
            size="lg"
          />
        ) : (
          <FontAwesomeIcon
            icon={faEllipsisH}
            onClick={handleTitleInfoClick}
            size="lg"
          />
        ))}
    </div>
  );
};

export default ChatHeader;
