import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Component } from "react";
import Router from "next/router";
import axios from "axios";
import Link from "next/link";
import Notification from "./navbarComponents/notification";
import FriendRequest from "./navbarComponents/friendRequest";
const links = require("../config/links");

class Navbar extends Component {
  state = {
    profileOpen: false,
  };

  handleProflieClick = async () => {
    let profileOpen = !this.state.profileOpen;
    if (!profileOpen) {
      this.props.ClearNotifications();
      await axios.post(`${links.users}/notifications/clear`, {
        userName: this.props.user.name,
      });
    }
    this.setState({ profileOpen });
  };

  handleLogout = async () => {
    this.props.socket.emit("LOGOUT", this.props.user.name);
    await axios.get(links.logout);
    Router.push("/");
  };

  render() {
    const { profileOpen } = this.state;
    const { requests, notifications, user } = this.props;
    return (
      <nav className="navbar navbar-expand">
        <div className="navbar-brand">
          <Link href="/">
            <FontAwesomeIcon icon={faComments} size="lg" />
          </Link>
          <Link href="/">
            <span>CHAT</span>
          </Link>
        </div>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {this.props.user && this.props.user.name ? (
            <ul className="navbar-nav ml-auto">
              <li onClick={this.handleProflieClick}>
                <img src={this.props.user.imagePath} />
                <FontAwesomeIcon icon={faAngleDown} size="lg" />
                <span
                  className={
                    requests.length !== 0 || notifications.length !== 0
                      ? "notification-dot"
                      : ""
                  }
                />
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ml-auto">
              <li>
                <Link href="/login">
                  <button id="login-button">LOGIN</button>
                </Link>
              </li>
              <li>
                <Link href="/register">
                  <button id="register-button">REGISTER</button>
                </Link>
              </li>
            </ul>
          )}
          {profileOpen && (
            <>
              <div className="profile">
                <span>Hi, {this.props.user.name} ~</span>
                <div className="notification-wrapper">
                  <div>
                    <span id="notification-button">Notifications</span>
                    <div className="notification-section">
                      {requests.length === 0 && notifications.length === 0 && (
                        <span>You Don't Have Any Notifications</span>
                      )}
                      {notifications.map((notification, index) => {
                        return (
                          <Notification
                            notification={notification}
                            key={`notification-${index}`}
                          />
                        );
                      })}
                      {requests.map((requestSenderName, index) => {
                        return (
                          <FriendRequest
                            requestSenderName={requestSenderName}
                            user={user}
                            key={`friend-request-${index}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div id="sign-out-button" onClick={this.handleLogout}>
                  Sign Out
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    );
  }
}

export default Navbar;
