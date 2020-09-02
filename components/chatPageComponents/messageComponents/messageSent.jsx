import Message from "./message";

const MessageSent = ({ imagePath, content }) => {
  return (
    <div className="chat-message chat-message-sent">
      <Message messageType="message-sent" message={content} />
      <img src={imagePath} />
    </div>
  );
};

export default MessageSent;
