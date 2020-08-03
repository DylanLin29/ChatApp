import { Input } from "semantic-ui-react";
import Message from "./message";
import { useState, useEffect } from "react";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:3000";
const socket = io(ENDPOINT);

const FriendsList = () => {
  const [message, setMessage] = useState({ id: 1, content: "" });
  const [response, setResponse] = useState([]);

  useEffect(() => {
    socket.on("RECEIVE_MESSAGE", (data) => {
      let updateResponses = response;
      updateResponses.push(data);
      setResponse(updateResponses);
    });
  }, []);

  const handleInputChange = ({ currentTarget: input }) => {
    const newMessage = { ...message };
    newMessage.content = input.value;
    setMessage(newMessage);
  };

  const handleInputEnter = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
    }
    const removeSpaces = message.content.replace(/\s/g, "");
    if (event.key === "Enter" && removeSpaces) {
      socket.emit("SEND_MESSAGE", message);
      const clearMessage = { ...message };
      clearMessage.content = "";
      setMessage(clearMessage);
    }
  };

  console.log(response);

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
            {response?.map(({ id, content }) => {
              return id === message.id ? (
                <div className="chat-message chat-message-sent">
                  <Message messageType="message-sent" message={content} />
                  <img src="https://playjoor.com/assets/avatar/patrick.png" />
                </div>
              ) : (
                <div className="chat-message">
                  <img src="https://playjoor.com/assets/avatar/matthew.png" />
                  <Message messageType="message-receive" message={content} />
                </div>
              );
            })}
          </div>
          <div className="chat-input">
            <textarea
              type="text"
              placeholder="Message to Mattew"
              onKeyDown={handleInputEnter}
              onChange={handleInputChange}
              value={message.content}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
