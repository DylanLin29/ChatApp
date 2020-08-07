import Form from "./common/form";

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
        <Form
          title="REGISTER"
          handleFormContinueClick={handleFormContinueClick}
        />
      </div>
    </div>
  );
};

export default RegisterForm;
