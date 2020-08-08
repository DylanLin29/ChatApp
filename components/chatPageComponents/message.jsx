const Message = ({ messageType, message }) => {
  return <div className={messageType}>{message}</div>;
};

export default Message;
