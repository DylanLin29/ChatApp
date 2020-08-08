const FriendsList = ({ groups, handleOpenChat }) => {
  return (
    <div className="friends-list">
      {groups.map(({ name, imagePath }) => {
        return (
          <div
            className="friend-info"
            onClick={() => handleOpenChat(name, imagePath)}
          >
            <img src={imagePath} />
            <span>{name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default FriendsList;
