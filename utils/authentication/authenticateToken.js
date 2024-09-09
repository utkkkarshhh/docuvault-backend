const env = require("./../../utils/dotenvConfig");
const jwt = require("jsonwebtoken");
const Constants = require("../../constants/Constants");
const Messages = require("./../../constants/Messages");

env();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(Constants.STATUS_CODES.UNAUTHORIZED);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(Constants.STATUS_CODES.FORBIDDEN);

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
