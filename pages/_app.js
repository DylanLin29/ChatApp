import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";
import "../styles/charactersList.css";
import "../styles/message.css";
import "../styles/friendsList.css";
import "../styles/navbar.css";
import "../styles/registerPage.css";
import "../styles/loginPage.css";
import "../styles/reuseComponents.css";
import "../styles/index.css";
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
