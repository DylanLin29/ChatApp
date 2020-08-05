import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faAngleDown } from "@fortawesome/free-solid-svg-icons";
const Navbar = ({ user }) => {
  return (
    <nav className="navbar navbar-expand">
      <div className="navbar-brand">
        <FontAwesomeIcon icon={faComments} size="lg" />
        <span>CHAT</span>
      </div>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        {user && (
          <ul className="navbar-nav ml-auto">
            <li>
              <img src={user.imagePath} />
              <FontAwesomeIcon icon={faAngleDown} />
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
