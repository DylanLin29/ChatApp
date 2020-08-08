import Message from "./message";

const MessageSection = ({ messagesRef, response, username, userImagePath }) => {
  return (
    <div className="chat-message-wrapper" ref={messagesRef}>
      {response?.map(({ id, content, imagePath }) => {
        return id === username ? (
          <div className="chat-message chat-message-sent">
            <Message messageType="message-sent" message={content} />
            <img src={userImagePath} />
          </div>
        ) : (
          <div className="chat-message">
            <img src={imagePath} />
            <Message messageType="message-receive" message={content} />
          </div>
        );
      })}
    </div>
  );
};

export default MessageSection;
