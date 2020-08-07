const jwt = require("jsonwebtoken");

function createToken(res, name, imagePath, _id) {
  const token = jwt.sign(
    {
      name: name,
      imagePath: imagePath,
      _id: _id,
    },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
  );
  res.cookie("user-auth", token, {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    maxAge: 3600000,
  });
}

module.exports = createToken;
