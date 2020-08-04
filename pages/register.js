import Navbar from "../components/navbar";
import CharactersList from "../components/charactersList";
import RegisterForm from "../components/registerForm";
import { Component } from "react";
import axios from "axios";

class Register extends Component {
  state = {
    user: {
      name: "lin22",
      email: "",
      password: "12345",
      imagePath: "",
    },
  };

  handleSelect = (imagePath) => {
    const user = { ...this.state.user };
    user.imagePath = imagePath;
    this.setState({ user }, async () => {
      await axios.post("http://localhost:3000/api/register", this.state.user);
    });
  };

  render() {
    return (
      <div className="register-page">
        <Navbar />
        <RegisterForm />
        <CharactersList handleSelect={this.handleSelect} />
      </div>
    );
  }
}

export default Register;
