import { Component } from "react";
import Navbar from "../components/navbar";
class Home extends Component {
  render() {
    return (
      <div className="chat-page">
        <Navbar />
        <h1>FLASH CHAT</h1>
        <img src="../images/LandingPage_1.png" />
        <img src="../images/LandingPage_2.png" />
        {/* <div className="footer">PlaceHolder</div> */}
      </div>
    );
  }
}

export default Home;
