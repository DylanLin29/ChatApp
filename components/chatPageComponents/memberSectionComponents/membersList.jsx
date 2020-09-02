const MembersList = ({
  memberSectionOpen,
  members,
  user,
  memberName,
  memberInfoOpen,
  handleMemberInfoClick,
  groupAdmin,
  handleDeleteGroup,
  handleLeaveClick,
}) => {
  return (
    <div
      className={
        memberSectionOpen ? "members-list members-list-open" : "members-list"
      }
    >
      {members.map(({ name, imagePath }, index) => {
        return (
          <div
            className={
              name === memberName && memberInfoOpen && memberSectionOpen
                ? "member-info member-info-active"
                : "member-info"
            }
            key={`member-info-${index}`}
            onClick={() => handleMemberInfoClick(name, imagePath)}
          >
            <img src={imagePath} />
            <span>{name}</span>
          </div>
        );
      })}
      {user.name === groupAdmin ? (
        <div className="group-options">
          <div onClick={handleDeleteGroup}>Delete</div>
          <div onClick={handleLeaveClick}>Leave</div>
        </div>
      ) : (
        <div className="group-options">
          <div onClick={handleLeaveClick}>Leave</div>
        </div>
      )}
    </div>
  );
};

export default MembersList;
