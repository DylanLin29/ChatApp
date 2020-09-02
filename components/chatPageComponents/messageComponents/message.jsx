const Message = ({ messageType, message, name, isPrivateMessage }) => {
  return (
    <div>
      <div className={messageType}>
        {" "}
        {messageType === "message-receive" && !isPrivateMessage && (
          <span className="message-name">{name}</span>
        )}
        {message}
      </div>
    </div>
  );
};

export default Message;
