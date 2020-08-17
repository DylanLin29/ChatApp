const FriendsList = ({
  groups,
  friends,
  handleOpenGroupChat,
  handleOpenFriendChat,
}) => {
  return (
    <div className="friends-list">
      {groups.map(({ name, imagePath }, index) => {
        return (
          <div
            className="friend-info"
            onClick={() => handleOpenGroupChat(name, imagePath)}
            key={`friend-info-group-${index}`}
          >
            <img src={imagePath} />
            <span>{name}</span>
          </div>
        );
      })}
      {friends.map(({ name, imagePath }, index) => {
        return (
          <div
            className="friend-info"
            onClick={() => handleOpenFriendChat(name, imagePath)}
            key={`friend-info-friend-${index}`}
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
