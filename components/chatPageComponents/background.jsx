const Background = ({ hasFriends }) => {
  return (
    <div className="background-wrapper">
      <img src="../../images/Background_Icon.png" />
      <h3>STAY CONNECTED!</h3>
      {hasFriends ? (
        <p>Say Hello to Your Friends</p>
      ) : (
        <p>Send Your First Friend Request</p>
      )}
    </div>
  );
};

export default Background;
