const FriendRequest = ({ requestSenderName, user }) => {
  return (
    <div
      className="each-notification"
      key={`friend-request-${requestSenderName}-${user.name}`}
    >
      <span>
        <span style={{ color: "#d6d8e0", padding: "0rem" }}>
          {requestSenderName}
        </span>{" "}
        Sent You a Friend Request
      </span>
      <div className="notification-buttons-wrapper">
        <button
          className="cancel-button"
          onClick={() =>
            this.props.handleFriendRequestDecline(requestSenderName)
          }
        >
          Decline
        </button>
        <button
          className="continue-button"
          onClick={() =>
            this.props.handleFriendRequestAccept(requestSenderName)
          }
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default FriendRequest;
