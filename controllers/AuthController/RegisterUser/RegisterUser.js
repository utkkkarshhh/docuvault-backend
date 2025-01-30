const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const Messages = require("../../../constants/Messages");
const Constant = require("../../../constants/Constants");
const {
  sequelize,
  models: {
    userLogin: UserLogin,
    userDetail: UserDetails,
    userLimit: UserLimit,
    publicVisibility: PublicVisibilty,
  },
} = require("docuvault-database");
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

module.exports = registerUser;
