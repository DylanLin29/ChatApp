const MembersList = ({ groups, membersListOpen, handleLeaveClick }) => {
  return (
    <div
      className={
        membersListOpen ? "members-list members-list-open" : "members-list"
      }
    >
      {groups.map(({ name, imagePath }, index) => {
        return (
          <div className="member-info" key={`member-info-${index}`}>
            <img src={imagePath} />
            <span>{name}</span>
          </div>
        );
      })}
      <div className="group-leave" onClick={handleLeaveClick}>
        Leave
      </div>
    </div>
  );
};

export default MembersList;
