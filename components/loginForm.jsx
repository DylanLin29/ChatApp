import { useState } from "react";
import Router from "next/router";
import Form from "./common/form";
import axios from "axios";
import links from "../config/links";

const LoginForm = () => {
  const [error, setError] = useState("");

  const handleFormContinueClick = async (username, password) => {
    try {
      const result = await axios.post(links.login, {
        name: username,
        password: password,
      });
      Router.push("/chat");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-form-wrapper">
      <Form title="Login" handleFormContinueClick={handleFormContinueClick} />
    </div>
  );
};

export default LoginForm;
