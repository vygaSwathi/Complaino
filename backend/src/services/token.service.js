const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
      issuer: "campus-connect",
      audience: "campus-connect-client",
    }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
      issuer: "campus-connect",
      audience: "campus-connect-client",
    }
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET, {
    issuer: "campus-connect",
    audience: "campus-connect-client",
  });
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
    issuer: "campus-connect",
    audience: "campus-connect-client",
  });
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};