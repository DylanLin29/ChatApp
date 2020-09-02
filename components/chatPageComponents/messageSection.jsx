import MessageSent from "./messageComponents/messageSent";
import MessageReceive from "./messageComponents/messageReceive";
import GroupNotification from "./messageComponents/groupNotification";

const MessageSection = ({
  messagesRef,
  response,
  username,
  friendname,
  userImagePath,
  friendImagePath,
  isFriendChat,
}) => {
  return (
    <div className="chat-message-wrapper" ref={messagesRef}>
      {isFriendChat
        ? // Private Messages
          response?.map(({ friendName, content, id }, index) => {
            return (id && id === username) || friendName === friendname ? (
              <MessageSent
                imagePath={userImagePath}
                content={content}
                key={`chat-message-friend-${index}`}
              />
            ) : (
              <MessageReceive
                imagePath={friendImagePath}
                content={content}
                name={friendname}
                isPrivateMessage={true}
                key={`chat-message-${index}`}
              />
            );
          })
        : // Group Messages
          response?.map(({ id, content, imagePath }, index) => {
            if (!id) {
              return (
                <GroupNotification
                  key={`chat-message-${index}`}
                  content={content}
                />
              );
            } else {
              return id === username ? (
                <MessageSent
                  imagePath={userImagePath}
                  content={content}
                  key={`chat-message-${index}`}
                />
              ) : (
                <MessageReceive
                  imagePath={imagePath}
                  content={content}
                  name={id}
                  isPrivateMessage={false}
                  key={`chat-message-${index}`}
                />
              );
            }
          })}
    </div>
  );
};

export default MessageSection;
