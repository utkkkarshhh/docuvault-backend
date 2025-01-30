const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Messages = require("../../../constants/Messages");
const Constant = require("../../../constants/Constants");
const {
  sequelize,
  models: {
    userLogin: UserLogin
  },
} = require("docuvault-database");
const { Op, Sequelize } = require("sequelize");

const userLogin = async (req, res) => {
  const { identifier, password } = req.body;
  console.log(identifier + password)
  try {
    if (!identifier) {
      return res.status(Constant.STATUS_CODES.BAD_REQUEST).json({
        message: Messages.VALIDATION.IDENTIFIER_REQUIRED,
        success: false,
      });
    }

    if (!password) {
      return res.status(Constant.STATUS_CODES.BAD_REQUEST).json({
        message: Messages.VALIDATION.PASSWORD_MISSING,
        success: false,
      });
    }

    const whereClause = {
      [Sequelize.Op.or]: [{ username: identifier }, { email: identifier }],
    };

    const user = await UserLogin.findOne({
      where: whereClause,
    });

    if (!user) {
      return res
        .status(Constant.STATUS_CODES.NOT_FOUND)
        .json({ message: Messages.USER.NO_USER_FOUND, success: false });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(Constant.STATUS_CODES.UNAUTHORIZED).json({
        message: Messages.VALIDATION.INCORRECT_PASSWORD,
        success: false,
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    return res.status(Constant.STATUS_CODES.OK).json({
      message: Messages.VALIDATION.LOGIN_SUCCESSFUL,
      success: true,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        name: user.name,
      },
      token: token,
    });
  } catch (error) {
    res
      .status(Constant.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.GENERAL.INTERNAL_SERVER, success: false });
  }
};

module.exports = userLogin;
