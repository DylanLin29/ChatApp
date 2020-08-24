import Message from "./message";

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
              <div
                className="chat-message chat-message-sent"
                key={`chat-message-friend-${index}`}
              >
                <Message messageType="message-sent" message={content} />
                <img src={userImagePath} />
              </div>
            ) : (
              <div
                className="chat-message is-private-message"
                key={`chat-message-${index}`}
              >
                <img src={friendImagePath} />
                <Message
                  messageType="message-receive"
                  message={content}
                  name={friendname}
                  isPrivateMessage={true}
                />
              </div>
            );
          })
        : // Group Messages
          response?.map(({ id, content, imagePath }, index) => {
            if (!id) {
              return (
                <div id="group-notification" key={`chat-message-${index}`}>
                  {content}
                </div>
              );
            } else {
              return id === username ? (
                <div
                  className="chat-message chat-message-sent"
                  key={`chat-message-${index}`}
                >
                  <Message messageType="message-sent" message={content} />
                  <img src={userImagePath} />
                </div>
              ) : (
                <div className="chat-message" key={`chat-message-${index}`}>
                  <img src={imagePath} />
                  <Message
                    messageType="message-receive"
                    message={content}
                    name={id}
                    isPrivateMessage={false}
                  />
                </div>
              );
            }
          })}
    </div>
  );
};

export default MessageSection;
