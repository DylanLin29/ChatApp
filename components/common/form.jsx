import { useState } from "react";
const Form = ({ title, handleFormContinueClick }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <form className="register-form">
      <h2>{title}</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(event) => handleUsernameChange(event)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(event) => handlePasswordChange(event)}
      />
      <div className="register-form-buttons">
        <a href="/" className="characters-reselect-button">
          Cancel
        </a>
        <div
          className="characters-continue-button"
          onClick={() => handleFormContinueClick(username, password)}
        >
          Continue
        </div>
      </div>
    </form>
  );
};

export default Form;
