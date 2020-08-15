import Form from "./common/form";
import axios from "axios";
import links from "../config/links";
import { useState } from "react";

const RegisterForm = ({ handleFormContinueClick, charactersDisplay }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const handleRegisterContinueClick = async (username, password) => {
    const result = await axios.get(links.users, {
      params: { name: username },
    });
    if (result.data.success) {
      handleFormContinueClick(username, password);
    } else {
      setErrorMessage("This given username already exists");
    }
  };
  return (
    <div
      className={
        charactersDisplay
          ? "register-form-wrapper register-form-hide"
          : "register-form-wrapper register-form-display"
      }
    >
      <div
        className={
          charactersDisplay ? "register-form-hide" : "register-form-display"
        }
      >
        <Form
          title="REGISTER"
          handleFormContinueClick={handleRegisterContinueClick}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
};

export default RegisterForm;
