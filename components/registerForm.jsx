const RegisterForm = ({ handleFormContinueClick, charactersDisplay }) => {
  return (
    <div
      className={
        charactersDisplay
          ? "register-form-wrapper register-form-hide"
          : "register-form-wrapper register-form-display"
      }
    >
      <div
        className={
          charactersDisplay ? "register-form-hide" : "register-form-display"
        }
      >
        <form className="register-form">
          <h2>REGISTER</h2>
          <input type="text" placeholder="Username" />
          <input type="text" placeholder="Password" />
          <div className="register-form-buttons">
            <a href="/" className="characters-reselect-button">
              Cancel
            </a>
            <div
              className="characters-continue-button"
              onClick={handleFormContinueClick}
            >
              Continue
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
