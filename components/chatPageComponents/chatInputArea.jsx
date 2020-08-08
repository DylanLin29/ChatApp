import { useState } from "react";

const ChatInputArea = ({ handleChatInputEnter, user, typingUser }) => {
  const [content, setContent] = useState("");

  const handleInputChange = ({ currentTarget: input }) => {
    setContent(input.value);
  };

  const handleInputEnter = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
    }
    const message = {
      id: user.name,
      imagePath: user.imagePath,
      content: content,
    };
    handleChatInputEnter(event, message);
    const removeSpaces = message.content.replace(/\s/g, "");
    if (event.key === "Enter" && removeSpaces) {
      setContent("");
    }
  };
  return (
    <div className="chat-input">
      <textarea
        type="text"
        placeholder="Message to Mattew"
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
