import { useState } from "react";
import Router from "next/router";
import Form from "./common/form";
import axios from "axios";
import links from "../config/links";

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormContinueClick = async (username, password) => {
    try {
      await axios.post(links.login, {
        name: username,
        password: password,
      });
      Router.push("/chat");
    } catch (err) {
      setErrorMessage("Username or Password is incorrect");
    }
  };

  return (
    <div className="login-form-wrapper">
      <Form
        title="LOGIN"
        handleFormContinueClick={handleFormContinueClick}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default LoginForm;
