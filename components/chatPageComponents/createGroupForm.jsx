const createGroupForm = ({ createFormOpen, handleCreateFormClose }) => {
  return (
    <div
      className={
        createFormOpen
          ? "create-group-form create-group-form-open"
          : "create-group-form"
      }
    >
      <h3>Create a Group Chat</h3>
      <p>Group Name: </p>
      <input type="text" />
      <p>Pick a Group Icon:</p>
      <div className="create-group-form-imgs-wrapper">
        <img src="../../images/GroupChat_1.png" />
        <img src="../../images/GroupChat_2.png" />
        <img src="../../images/GroupChat_3.png" />
        <img src="../../images/GroupChat_4.png" />
      </div>
      <button onClick={handleCreateFormClose}>Cancel</button>
    </div>
  );
};

export default createGroupForm;
