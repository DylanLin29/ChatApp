import { Input } from "semantic-ui-react";
const FriendsList = () => {
  return (
    <div>
      <div className="chat-window">
        <div className="friends-list-container">
          <div className="friends-list">
            <div className="search-area">
              <Input placeholder="Search..." />
            </div>
            <div className="friend-info">
              <img src="https://playjoor.com/assets/avatar/matthew.png" />
              <span>Matthew</span>
            </div>
            <div className="friend-info">
              <img src="https://playjoor.com/assets/avatar/jenny.jpg" />
              <span>Jenny</span>
            </div>
            <div className="friend-info">
              <img src="https://playjoor.com/assets/avatar/joe.jpg" />
              <span>Joe</span>
            </div>
          </div>
        </div>
        <div className="chat-window-current-title">
          <img src="https://playjoor.com/assets/avatar/matthew.png" />
          <span>Matthew</span>
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
