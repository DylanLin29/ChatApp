const Notification = ({ notification }) => {
  return (
    (notification.type === "delete friend" && (
      <div className="each-notification notification">
        Oops! You Have Been Deleted By{" "}
        <div
          style={{
            paddingTop: "0.45rem",
            marginTop: "0.45rem",
            margin: "0",
            color: "#d6d8e0",
          }}
        >
          {notification.friendName}
        </div>
      </div>
    )) ||
    (notification.type === "delete group" && (
      <div className="each-notification notification">
        <span
          style={{
            color: "#d6d8e0",
            margin: "0",
            padding: "0",
          }}
        >
          {notification.adminName}{" "}
        </span>
        has deleted{" "}
        <span
          style={{
            color: "#d6d8e0",
            margin: "0",
            padding: "0",
          }}
        >
          {notification.groupName}
        </span>
      </div>
    )) ||
    (notification.type === "delete member" && (
      <div className="each-notification notification">
        You have been deleted from{" "}
        <span
          style={{
            color: "#d6d8e0",
            margin: "0",
            padding: "0",
          }}
        >
          {notification.groupName}
        </span>
      </div>
    ))
  );
};

export default Notification;
