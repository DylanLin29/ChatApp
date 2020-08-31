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
  };

  handleProflieClick = () => {
    let profileOpen = !this.state.profileOpen;
    if (!profileOpen) {
      this.props.ClearNotifications();
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
                      {notifications.map((notification) => {
                        return (
                          (notification.type === "delete friend" && (
                            <div className="each-notification notification">
                              Oops! You Have Been Deleted By{" "}
                              <div
                                style={{
                                  paddingTop: "0.45rem",
                                  marginTop: "0.45rem",
                                  margin: "0",
                                  color: "#d6d8e0",
                                }}
                              >
                                {notification.friendName}
                              </div>
                            </div>
                          )) ||
                          (notification.type === "delete group" && (
                            <div className="each-notification notification">
                              <span
                                style={{
                                  color: "#d6d8e0",
                                  margin: "0",
                                  padding: "0",
                                }}
                              >
                                {notification.adminName}{" "}
                              </span>
                              has deleted{" "}
                              <span
                                style={{
                                  color: "#d6d8e0",
                                  margin: "0",
                                  padding: "0",
                                }}
                              >
                                {notification.groupName}
                              </span>
                            </div>
                          ))
                        );
                      })}
                      {requests.map((requestSenderName) => {
                        return (
                          <div
                            className="each-notification"
                            key={`friend-request-${requestSenderName}-${user.name}`}
                          >
                            <span>
                              <span
                                style={{ color: "#d6d8e0", padding: "0rem" }}
                              >
                                Dylan
                              </span>{" "}
                              Sent You a Friend Request
                            </span>
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
                          </div>
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
