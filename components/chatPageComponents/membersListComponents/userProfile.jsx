const UserProfile = ({
  imagePath,
  name,
  handleCloseClick,
  handleDeleteFriend,
}) => {
  return (
    <div className="group-form group-form-open">
      <img src={imagePath} />
      <h3>{name}</h3>
      <div className="join-group-form-buttons">
        <button className="close-button" onClick={handleCloseClick}>
          Close
        </button>
        <button className="cancel-button" onClick={handleDeleteFriend}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
