import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faAngleDown } from "@fortawesome/free-solid-svg-icons";
const Navbar = () => {
  return (
    <nav class="navbar navbar-expand">
      <div class="navbar-brand">
        <FontAwesomeIcon icon={faComments} size="lg" />
        <span>CHAT</span>
      </div>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <li>
            <img src="https://playjoor.com/assets/avatar/patrick.png" />
            <FontAwesomeIcon icon={faAngleDown} />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
