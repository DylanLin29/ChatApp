import Navbar from "../components/navbar";
import CharactersList from "../components/charactersList";
import RegisterForm from "../components/registerForm";
import { Component } from "react";
import axios from "axios";
import Router from "next/router";
const links = require("../config/links");

class Register extends Component {
  state = {
    user: {
      name: "",
      password: "",
      imagePath: "",
    },
    continueClick: false,
  };

  handleSelect = async (imagePath) => {
    const user = { ...this.state.user };
    user.imagePath = imagePath;
    await axios.post(links.users, user);
    await axios.post(links.login, {
      name: user.name,
      password: user.password,
    });
    Router.push("/chat");
  };

  handleFormContinueClick = (username, password) => {
    const user = { ...this.state.user };
    user.name = username;
    user.password = password;
    this.setState({ continueClick: true, user });
  };

  render() {
    return (
      <div className="register-page">
        <Navbar />
        <RegisterForm
          handleFormContinueClick={this.handleFormContinueClick}
          charactersDisplay={this.state.continueClick}
        />
        <CharactersList
          handleSelect={this.handleSelect}
          charactersDisplay={this.state.continueClick}
        />
      </div>
    );
  }
}

export default Register;
