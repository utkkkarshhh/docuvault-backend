const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../../db/sequelizeConnection");
const Messages = require("../../constants/Messages");
const Constant = require("../../constants/Constants");
const User = require("../../models/users")(sequelize);
const { Op } = require("sequelize");

app.use(express.json());

const registerUser = async (req, res) => {
  const { email, username, password, token } = req.body;
  console.log(email, username, password, token);

  try {
    if (token !== process.env.REGISTER_TOKEN) {
      return res
        .status(Constant.STATUS_CODES.UNAUTHORIZED)
        .json({ message: Messages.VALIDATION.INVALID_TOKEN, success: false });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res
        .status(Constant.STATUS_CODES.BAD_REQUEST)
        .json({ message: Messages.VALIDATION.ALREADY_EXISTS, success: false });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      Constant.AUTH.SALT_ROUNDS
    );
    await User.create({
      user_id: uuidv4(),
      email,
      username,
      password: hashedPassword,
    });

    return res.status(Constant.STATUS_CODES.CREATED).json({
      message: Messages.VALIDATION.USER_REGISTERED_SUCCESSFULLY,
      success: true,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res
      .status(Constant.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.GENERAL.INTERNAL_SERVER, success: false });
  }
};

const loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
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
      { expiresIn: "1h" }
    );

    return res.status(Constant.STATUS_CODES.OK).json({
      message: Messages.VALIDATION.LOGIN_SUCCESSFUL,
      success: true,
      token: token,
    });
  } catch (error) {
    console.error("Error is LoginUser", error);
    res
      .status(Constant.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.GENERAL.INTERNAL_SERVER, success: false });
  }
};

const logoutUser = async (req, res) => {
  try {
    return res
      .status(Constant.STATUS_CODES.OK)
      .json({
        message: Messages.VALIDATION.LOGOUT_SUCCESSFULLY,
        success: false,
      });
  } catch (error) {
    console.error("Error in logoutUser:", error);
    res
      .status(Constant.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.GENERAL.INTERNAL_SERVER, success: false });
  }
};

module.exports = { registerUser, loginUser, logoutUser };
