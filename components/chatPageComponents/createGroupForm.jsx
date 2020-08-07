import { useState } from "react";

const createGroupForm = ({
  createFormOpen,
  handleCreateFormClose,
  handleCreateFormSubmit,
}) => {
  const [groupName, setGroupName] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [imageSelect, setImageSelect] = useState(-1);
  const images = [
    "../../images/GroupChat_1.png",
    "../../images/GroupChat_2.png",
    "../../images/GroupChat_3.png",
    "../../images/GroupChat_4.png",
  ];

  const clearInput = () => {
    setImagePath("");
    setGroupName("");
    setImageSelect(-1);
  };

  const handleGroupNameChange = ({ currentTarget: input }) => {
    setGroupName(input.value);
  };

  const handleImageSelect = (image, index) => {
    setImagePath(image);
    setImageSelect(index);
  };

  const handleCancelClick = () => {
    handleCreateFormClose();
    clearInput();
  };

  const handleCreateClick = () => {
    handleCreateFormSubmit(groupName, imagePath);
    clearInput();
  };

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
      <input
        type="text"
        value={groupName}
        onChange={(event) => handleGroupNameChange(event)}
      />
      <p>Pick a Group Icon:</p>
      <div className="create-group-form-imgs-wrapper">
        {images.map((image, index) => {
          return (
            <img
              src={image}
              key={image}
              onClick={() => handleImageSelect(image, index)}
              className={
                imageSelect === -1 || imageSelect === index
                  ? "group-image-show"
                  : "group-image-hide"
              }
            />
          );
        })}
      </div>
      <div>
        <button onClick={handleCancelClick}>Cancel</button>
        <button id="create-group-form-create" onClick={handleCreateClick}>
          Create
        </button>
      </div>
    </div>
  );
};

export default createGroupForm;
