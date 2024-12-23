const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../../db/sequelizeConnection");
const Messages = require("../../constants/Messages");
const Constant = require("../../constants/Constants");
const UserLogin = require("../../../database/models/userLogin")(sequelize);
const UserDetails = require("../../../database/models/userDetail")(sequelize);
const UserLimit = require("../../../database/models/userLimit")(sequelize);
const PublicVisibilty =
  require("../../../database/models/publicVisibility")(sequelize);
const { Op, Sequelize } = require("sequelize");

app.use(express.json());

const registerUser = async (req, res) => {
  const { email, username, password, token } = req.body;

  try {
    if (!email && !username) {
      return res.status(Constant.STATUS_CODES.BAD_REQUEST).json({
        message: Messages.VALIDATION.EMAIL_AND_USERNAME_REQUIRED,
        success: false,
      });
    }

    if (!email) {
      return res.status(Constant.STATUS_CODES.BAD_REQUEST).json({
        message: Messages.VALIDATION.EMAIL_REQUIRED,
        success: false,
      });
    }

    if (!username) {
      return res.status(Constant.STATUS_CODES.BAD_REQUEST).json({
        message: Messages.VALIDATION.USERNAME_REQUIRED,
        success: false,
      });
    }

    if (token !== process.env.REGISTER_TOKEN) {
      return res
        .status(Constant.STATUS_CODES.UNAUTHORIZED)
        .json({ message: Messages.VALIDATION.INVALID_TOKEN, success: false });
    }

    const existingUser = await UserLogin.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res
        .status(Constant.STATUS_CODES.BAD_REQUEST)
        .json({ message: Messages.VALIDATION.ALREADY_EXISTS, success: false });
    }

    const transaction = await sequelize.transaction();

    try {
      const hashedPassword = await bcrypt.hash(
        password,
        Constant.AUTH.SALT_ROUNDS
      );

      const userLogin = await UserLogin.create(
        {
          user_id: uuidv4(),
          email,
          username,
          password: hashedPassword,
        },
        { transaction }
      );

      await UserDetails.create(
        {
          user_id: userLogin.user_id,
          name: null,
          bio: null,
          dob: null,
        },
        { transaction }
      );

      await UserLimit.create({ user_id: userLogin.user_id }, { transaction });

      await PublicVisibilty.create(
        { user_id: userLogin.user_id },
        { transaction }
      );

      await transaction.commit();

      return res.status(Constant.STATUS_CODES.CREATED).json({
        message: Messages.VALIDATION.USER_REGISTERED_SUCCESSFULLY,
        success: true,
      });
    } catch (err) {
      await transaction.rollback();
      console.error("Transaction failed:", err);
      throw err;
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    res
      .status(Constant.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.GENERAL.INTERNAL_SERVER, success: false });
  }
};

const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

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
      { expiresIn: "1h" }
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

const logoutUser = async (req, res) => {
  try {
    return res.status(Constant.STATUS_CODES.OK).json({
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
