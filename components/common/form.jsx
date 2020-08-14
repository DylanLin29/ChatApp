import { useState } from "react";
import { Label } from "semantic-ui-react";
const Form = ({ title, handleFormContinueClick, errorMessage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    if (event.target.value.length < 3) {
      setUsernameError("Username must be greater than 2 characters");
    } else {
      setUsernameError("");
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (event.target.value.length < 5) {
      setPasswordError("Password must be greater than 5 characters");
    } else {
      setPasswordError("");
    }
  };

  const handleClick = () => {
    if (usernameError === "" && passwordError === "") {
      handleFormContinueClick(username, password);
    }
  };

  return (
    <form className="register-form">
      <h2>{title}</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div>
        <div className="input-info">
          <p>Username</p>
          <input
            type="text"
            value={username}
            onChange={(event) => handleUsernameChange(event)}
            className={usernameError !== "" ? "input-with-error" : ""}
          />
        </div>
        {usernameError !== "" && (
          <Label basic pointing color="red">
            {usernameError}
          </Label>
        )}
      </div>
      <div>
        <div className="input-info">
          <p>Password</p>
          <input
            type="password"
            value={password}
            onChange={(event) => handlePasswordChange(event)}
          />
        </div>
        {passwordError !== "" && (
          <Label basic pointing color="red">
            {passwordError}
          </Label>
        )}
        <div className="switch-form">
          {title === "LOGIN" ? (
            <div>
              Haven't registered?{" "}
              <a href="/register" style={{ color: "#f8c27c" }}>
                Sign up!
              </a>
            </div>
          ) : (
            <div>
              Already registered?{" "}
              <a href="/login" style={{ color: "#62dbeb" }}>
                Login!
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="register-form-buttons">
        <a href="/">
          <div className="characters-reselect-button">Cancel</div>
        </a>
        <div
          className={
            usernameError !== "" ||
            passwordError !== "" ||
            username === "" ||
            password === ""
              ? "characters-continue-button continue-disabled"
              : "characters-continue-button"
          }
          onClick={handleClick}
        >
          Continue
        </div>
      </div>
    </form>
  );
};

export default Form;
