import JoinGroupForm from "./joinGroupForm";
import ProfileForm from "./profileForm";
const searchResult = ({
  joinGroupFormOpen,
  group,
  handleJoinFormSubmit,
  handleJoinFormClose,
  handleJoinFormOpen,
  userJoined,
  searchUser,
  userName,
  handleProfileClose,
  profileOpen,
  socket,
}) => {
  return (
    <div className="search-result-wrapper">
      <JoinGroupForm
        joinGroupFormOpen={joinGroupFormOpen}
        group={group}
        handleJoinFormClose={handleJoinFormClose}
        handleJoinFormSubmit={handleJoinFormSubmit}
        handleJoinFormOpen={handleJoinFormOpen}
        userJoined={userJoined}
      />
      <ProfileForm
        searchUser={searchUser}
        profileOpen={profileOpen}
        handleProfileClose={handleProfileClose}
        groupFound={joinGroupFormOpen}
        userName={userName}
        socket={socket}
      />
    </div>
  );
};

export default searchResult;
