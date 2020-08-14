import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faAngleDown,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Router from "next/router";
import axios from "axios";
import Link from "next/link";
const links = require("../config/links");

const Navbar = ({ user }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleProflieClick = () => {
    let updateProfileOpen = !profileOpen;
    setProfileOpen(updateProfileOpen);
  };

  const handleNotificationClick = () => {
    const updateNotificationOpen = !notificationOpen;
    setNotificationOpen(updateNotificationOpen);
  };

  const handleLogout = async () => {
    await axios.get(links.logout);
    Router.push("/");
  };

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
        {user ? (
          <ul className="navbar-nav ml-auto">
            {/* <li>
              <FontAwesomeIcon
                icon={faBell}
                size="lg"
                onClick={handleNotificationClick}
              />
            </li> */}
            <li onClick={handleProflieClick}>
              <img src={user.imagePath} />
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
        {/* {notificationOpen && (
          <div id="notification">
            <ul>
              <li>Dylan sent you a friend Request</li>
              <li>Lin sent you a friend Request</li>
            </ul>
          </div>
        )} */}
        {profileOpen && (
          <div id="sign-out-button" onClick={handleLogout}>
            Sign Out
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
