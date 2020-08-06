import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
const Navbar = ({ user }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  const handleProflieClick = () => {
    let updateProfileOpen = !profileOpen;
    setProfileOpen(updateProfileOpen);
  };

  return (
    <nav className="navbar navbar-expand">
      <div className="navbar-brand">
        <FontAwesomeIcon icon={faComments} size="lg" />
        <span>CHAT</span>
      </div>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        {user && (
          <ul className="navbar-nav ml-auto">
            <li onClick={handleProflieClick}>
              <img src={user.imagePath} />
              <FontAwesomeIcon icon={faAngleDown} />
            </li>
          </ul>
        )}
        {profileOpen && <div id="sign-out-button">Sign Out</div>}
      </div>
    </nav>
  );
};

export default Navbar;
