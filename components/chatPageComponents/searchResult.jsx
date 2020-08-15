import JoinGroupForm from "./joinGroupForm";
import ProfileForm from "./profileForm";
const searchResult = ({
  joinGroupFormOpen,
  group,
  handleJoinFormSubmit,
  handleJoinFormClose,
  handleJoinFormOpen,
  userJoined,
  user,
  handleProfileOpen,
  handleProfileClose,
  profileOpen,
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
        user={user}
        handleProfileOpen={handleProfileOpen}
        profileOpen={profileOpen}
        handleProfileClose={handleProfileClose}
        groupFound={joinGroupFormOpen}
      />
    </div>
  );
};

export default searchResult;
