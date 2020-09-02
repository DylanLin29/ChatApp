import Message from "./message";

const MessageReceive = ({ imagePath, content, name, isPrivateMessage }) => {
  return (
    <div
      className={
        isPrivateMessage ? "chat-message is-private-message" : "chat-message"
      }
    >
      <img src={imagePath} />
      <Message
        messageType="message-receive"
        message={content}
        name={name}
        isPrivateMessage={isPrivateMessage}
      />
    </div>
  );
};

export default MessageReceive;
