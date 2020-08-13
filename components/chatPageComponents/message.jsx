const Message = ({ messageType, message, name }) => {
  return (
    <div>
      <div className={messageType}>
        {" "}
        {messageType === "message-receive" && (
          <span className="message-name">{name}</span>
        )}
        {message}
      </div>
    </div>
  );
};

export default Message;
