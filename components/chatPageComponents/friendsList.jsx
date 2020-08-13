const FriendsList = ({ groups, handleOpenChat }) => {
  return (
    <div className="friends-list">
      {groups.map(({ name, imagePath }, index) => {
        return (
          <div
            className="friend-info"
            onClick={() => handleOpenChat(name, imagePath)}
            key={`friend-info-${index}`}
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
