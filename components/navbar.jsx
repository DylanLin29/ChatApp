import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faAngleDown,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { Component } from "react";
import Router from "next/router";
import axios from "axios";
import Link from "next/link";
const links = require("../config/links");

class Navbar extends Component {
  state = {
    profileOpen: false,
    notificationOpen: false,
  };

  handleProflieClick = () => {
    let profileOpen = !this.state.profileOpen;
    this.setState({ profileOpen });
  };

  handleNotificationClick = () => {
    const notificationOpen = !this.state.notificationOpen;
    if (!notificationOpen) {
      this.props.ClearNotifications();
    }
    this.setState({ notificationOpen });
  };

  handleLogout = async () => {
    this.props.socket.emit("LOGOUT", this.props.user.name);
    await axios.get(links.logout);
    Router.push("/");
  };

  render() {
    const { profileOpen, notificationOpen } = this.state;
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
          {this.props.user ? (
            <ul className="navbar-nav ml-auto">
              <li>
                <div
                  className={
                    this.props.requests.length !== 0 ||
                    this.props.notifications.length
                      ? "red-bell"
                      : ""
                  }
                >
                  <FontAwesomeIcon
                    icon={faBell}
                    size="lg"
                    onClick={this.handleNotificationClick}
                  />
                </div>
              </li>
              <li onClick={this.handleProflieClick}>
                <img src={this.props.user.imagePath} />
                <FontAwesomeIcon icon={faAngleDown} />
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
          {notificationOpen && (
            <div id="notification">
              <ul>
                {this.props.requests.length !== 0 &&
                  this.props.requests.map((requestSenderName) => {
                    return (
                      <li
                        key={`requests-${this.props.user.name}-${requestSenderName}`}
                      >
                        <p>{requestSenderName} sent you a friend request</p>
                        <div className="notification-buttons-wrapper">
                          <button
                            className="cancel-button"
                            onClick={() =>
                              this.props.handleFriendRequestDecline(
                                requestSenderName
                              )
                            }
                          >
                            Decline
                          </button>
                          <button
                            className="continue-button"
                            onClick={() =>
                              this.props.handleFriendRequestAccept(
                                requestSenderName
                              )
                            }
                          >
                            Accept
                          </button>
                        </div>
                      </li>
                    );
                  })}
                {this.props.notifications.length !== 0 &&
                  this.props.notifications.map((senderName) => {
                    return (
                      <li
                        key={`notifications-${this.props.user.name}-${senderName}`}
                      >
                        <p id="no-notification">
                          Opps! You have been deleted by {senderName}
                        </p>
                      </li>
                    );
                  })}
                {this.props.notifications.length === 0 &&
                  this.props.requests.length === 0 && (
                    <p id="no-notification">You don't have any notifications</p>
                  )}
              </ul>
            </div>
          )}
          {profileOpen && (
            <div id="sign-out-button" onClick={this.handleLogout}>
              Sign Out
            </div>
          )}
        </div>
      </nav>
    );
  }
}

export default Navbar;
