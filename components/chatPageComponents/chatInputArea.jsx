import { useState } from "react";
import axios from "axios";
const links = require("../../config/links");
var timeout = undefined;

const ChatInputArea = ({
  user,
  typingUser,
  currentChatName,
  socket,
  isFriendChat,
}) => {
  const [content, setContent] = useState("");
  const message = {
    id: user.name,
    imagePath: user.imagePath,
    content: content,
  };

  const handleInputChange = ({ currentTarget: input }) => {
    setContent(input.value);
  };

  const handleNoTyping = () => {
    socket.emit("NOT_TYPING", user.name);
  };

  const handleInputEnter = async (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
    }

    if (event.key !== "Enter") {
      socket.emit("TYPING", {
        name: user.name,
        room: currentChatName,
      });
      clearTimeout(timeout);
      // If user doesn't type in 5 seconds, indicates not typing
      timeout = setTimeout(handleNoTyping, 5000);
    } else {
      const removeSpaces = message.content.replace(/\s/g, "");
      if (event.key === "Enter" && removeSpaces) {
        setContent("");
        clearTimeout(timeout);
        if (isFriendChat) {
          socket.emit("PRIVATE_MESSAGE", {
            friendName: currentChatName,
            message: message,
          });
          // save private message to database
          await axios.post(`${links.messages}/privateMessage`, {
            content: message.content,
            friendName: currentChatName,
            userName: user.name,
          });
        } else {
          socket.emit("MESSAGE", {
            message: message,
            room: currentChatName,
          });
          // save group message to database
          await axios.post(links.messages, {
            username: message.id,
            imagePath: message.imagePath,
            content: message.content,
            groupName: currentChatName,
          });
        }
        handleNoTyping();
      }
    }
  };

  return (
    <div className="chat-input">
      <textarea
        type="text"
        placeholder={"PRESS ENTER TO SEND"}
        onKeyDown={(event) => handleInputEnter(event)}
        onChange={(event) => handleInputChange(event)}
        value={content}
      />

      {/* Detect user typing */}
      {typingUser && <p>{typingUser} is typing...</p>}
    </div>
  );
};

export default ChatInputArea;
