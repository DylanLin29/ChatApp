import { Component } from "react";
import Navbar from "../components/navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faDatabase,
  faUsers,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";
class Home extends Component {
  render() {
    return (
      // <div className="chat-page">
      //   <Navbar />
      //   <h1>FLASH CHAT</h1>
      //   <img src="../images/LandingPage_1.png" />
      //   <img src="../images/LandingPage_2.png" />
      // </div>
      <div className="landingPage">
        <header>
          <div className="logo">
            <FontAwesomeIcon icon={faComments} size="2x" />
            <span> CHAT </span>
          </div>
          <div className="menu">
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/login">Login</a>
              </li>
            </ul>
          </div>
        </header>

        <div className="content">
          <h1>FLASH CHAT</h1>
          <p>
            A chat app creates the oppotunity to join a group that you are
            insterested in
          </p>
          <a href="/login">
            <div className="btn-group">Start Chatting</div>
          </a>
        </div>

        <div className="functionality">
          <h2>Funtionality</h2>
          <div className="functionality-wrapper">
            <div>
              <FontAwesomeIcon icon={faUsers} size="3x" />{" "}
              <span>Group Chat</span>
            </div>
            <div>
              <FontAwesomeIcon icon={faUserFriends} size="3x" />{" "}
              <span>Private Chat</span>
            </div>
            <div>
              <FontAwesomeIcon icon={faDatabase} size="3x" />{" "}
              <span>Messages Storage</span>
            </div>
          </div>
        </div>

        <svg
          className="wave"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#fff"
            fill-opacity="1"
            d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,234.7C672,256,768,256,864,229.3C960,203,1056,149,1152,144C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
        <div className="white-background" />
      </div>
    );
  }
}

export default Home;
