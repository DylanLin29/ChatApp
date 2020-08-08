import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";

const JoinGroupForm = ({
  joinGroupFormOpen,
  group,
  handleJoinFormSubmit,
  handleJoinFormClose,
}) => {
  console.log("joingroupForm", joinGroupFormOpen);
  return (
    <div
      className={
        joinGroupFormOpen
          ? "join-group-form join-group-form-open"
          : "join-group-form"
      }
    >
      <img src={group.imagePath} />
      <h3>{group.name}</h3>
      <div>
        <FontAwesomeIcon icon={faUserFriends} /> <span>{group.size}</span>
      </div>
      <div className="join-group-form-buttons">
        <button onClick={handleJoinFormClose}>Cancel</button>
        <button id={"join-group-form-join"} onClick={handleJoinFormSubmit}>
          Join
        </button>
      </div>
    </div>
  );
};

export default JoinGroupForm;
