import JoinGroupForm from "./joinGroupForm";
import ProfileForm from "./profileForm";
const searchResult = ({
  joinGroupFormOpen,
  searchGroup,
  handleJoinFormSubmit,
  handleJoinFormClose,
  searchUser,
  user,
  handleProfileClose,
  handleOpenFriendChat,
  handleOpenGroupChat,
  profileOpen,
  socket,
}) => {
  return (
    <div className="search-result-wrapper">
      <JoinGroupForm
        joinGroupFormOpen={joinGroupFormOpen}
        searchGroup={searchGroup}
        handleJoinFormClose={handleJoinFormClose}
        handleJoinFormSubmit={handleJoinFormSubmit}
        handleOpenGroupChat={handleOpenGroupChat}
        user={user}
      />
      <ProfileForm
        searchUser={searchUser}
        user={user}
        profileOpen={profileOpen}
        handleProfileClose={handleProfileClose}
        handleOpenFriendChat={handleOpenFriendChat}
        groupFound={joinGroupFormOpen}
        socket={socket}
      />
    </div>
  );
};

export default searchResult;
