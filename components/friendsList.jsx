import { Input } from "semantic-ui-react";
import Message from "./message";
const FriendsList = () => {
  return (
    <div>
      <div className="chat-window">
        <div className="friends-list-container">
          <div className="search-area">
            <Input placeholder="Search..." />
          </div>
          <div className="friends-list">
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
        <div className="content">
          <div className="chat-window-current-title">
            <img src="https://playjoor.com/assets/avatar/matthew.png" />
            <span>Matthew</span>
          </div>
          <div className="chat-message-wrapper">
            <div className="chat-message">
              <img src="https://playjoor.com/assets/avatar/matthew.png" />
              <Message messageType="message-receive" message="Hello" />
            </div>
            <div className="chat-message">
              <img src="https://playjoor.com/assets/avatar/matthew.png" />
              <Message messageType="message-receive" message="Hello" />
            </div>
            <div className="chat-message chat-message-sent">
              <Message messageType="message-sent" message="Sup" />
              <img src="https://playjoor.com/assets/avatar/patrick.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
