const GroupChatOperations = ({
  addButtonClick,
  handleJoinClick,
  handleCreateClick,
  handleCancelClick,
}) => {
  return (
    addButtonClick && (
      <div className="chat-groups-operations">
        <span onClick={handleJoinClick}>Search a Group Chat/User</span>
        <span onClick={handleCreateClick}>Create a Group Chat</span>
        <button className="cancel-button" onClick={handleCancelClick}>
          Cancel
        </button>
      </div>
    )
  );
};

export default GroupChatOperations;
