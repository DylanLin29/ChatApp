import Message from "./message";

const MessageSection = ({ messagesRef, response, username, userImagePath }) => {
  return (
    <div className="chat-message-wrapper" ref={messagesRef}>
      {response?.map(({ id, content, imagePath }, index) => {
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
              <Message messageType="message-receive" message={content} />
            </div>
          );
        }
      })}
    </div>
  );
};

export default MessageSection;
