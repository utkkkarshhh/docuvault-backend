const express = require("express");
const app = express();
const { sequelize, models: { 
  userLogin: UserLogin,
  userDetail: UserDetails,
}} = require("docuvault-database");
const Messages = require("../../constants/Messages");
const Constants = require("../../constants/Constants");
const { Op } = require("sequelize");

app.use(express.json());

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserDetails.findAll();

    if (users.length === 0) {
      return res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ message: Messages.USER.NO_USERS_FOUND, success: true });
    }

    res
      .status(Constants.STATUS_CODES.OK)
      .json({ response: users, success: true });
  } catch (err) {
    console.error(Messages.GENERAL.ERROR_EXECUTING_QUERY, err.stack);
    res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: Messages.GENERAL.INTERNAL_SERVER, success: false });
  }
};

// Get a single user by ID
const getAUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const userObject = await UserDetails.findOne({
      where: { user_id },
    });

    const userLoginObject = await UserLogin.findOne({
      where: { user_id },
    });

    if (!userObject || !userLoginObject) {
      return res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ message: Messages.USER.NO_USER_WITH_ID, success: false });
    }

    res.status(Constants.STATUS_CODES.OK).json({
      success: true,
      data: {
        user_id: userLoginObject.user_id,
        email: userLoginObject.email,
        username: userLoginObject.username,
        name: userObject.name,
        dob: userObject.dob,
        bio: userObject.bio,
        created_at: userLoginObject.created_at,
        updated_at: userLoginObject.updated_at,
      },
    });
  } catch (err) {
    console.error(Messages.GENERAL.ERROR_EXECUTING_QUERY, err.stack);
    res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: Messages.GENERAL.INTERNAL_SERVER, success: false });
  }
};

//  Update user By ID
const updateUserDetail = async (req, res) => {
  const { user_id } = req.params;
  const { name, bio, dob } = req.body;

  // Validate input
  if (!name && !bio && !dob) {
    return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
      error: Messages.VALIDATION.ONE_FIELD_REQUIRED,
    });
  }

  try {
    // Update UserDetails table
    const [updatedCount] = await UserDetails.update(
      { name, bio, dob },
      {
        where: { user_id },
      }
    );

    // Check if any rows were updated
    if (updatedCount === 0) {
      return res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ error: Messages.USER.NO_USER_FOUND });
    }

    // Fetch the updated user details
    const updatedUser = await UserDetails.findOne({
      where: { user_id },
    });

    res.status(Constants.STATUS_CODES.OK).json({
      success: true,
      message: Messages.USER.USER_UPDATED_SUCCESSFULLY,
      data: updatedUser,
    });
  } catch (err) {
    console.error(Messages.GENERAL.ERROR_EXECUTING_QUERY, err.stack);

    // Handle specific Sequelize errors
    if (err.name === "SequelizeValidationError") {
      return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
        error: Messages.VALIDATION.MISSING_REQUIRED_FIELDS,
        success: false,
      });
    } else {
      return res
        .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: Messages.GENERAL.INTERNAL_SERVER, success: false });
    }
  }
};

// Update user login
const updateUserLogin = async (req, res) => {
  const { username, email } = req.body;
  const { user_id } = req.params;

  // Validate input
  if (!username && !email) {
    return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
      error: Messages.VALIDATION.EMAIL_OR_USERNAME_REQUIRED,
      success: false,
    });
  }

  try {
    const existingUser = await UserLogin.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
        user_id: { [Op.ne]: user_id },
      },
    });

    if (existingUser) {
      return res.status(Constants.STATUS_CODES.CONFLICT).json({
        success: false,
        error: Messages.VALIDATION.ALREADY_EXISTS,
      });
    }

    // Update UserDetails table
    const [updatedCount] = await UserLogin.update(
      { username, email },
      {
        where: { user_id },
      }
    );

    // Check if any rows were updated
    if (updatedCount === 0) {
      return res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ error: Messages.USER.NO_USER_FOUND, success: false });
    }

    // Success response
    return res.status(Constants.STATUS_CODES.OK).json({
      message: Messages.USER.USER_UPDATED,
      success: true,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: Messages.GENERAL.INTERNAL_SERVER,
      success: false,
    });
  }
};

// Delete a user by ID
const deleteAUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const deleted = await UserLogin.destroy({
      where: { user_id },
    });

    if (deleted === 0) {
      return res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ error: Messages.USER.NO_USER_FOUND, success: false });
    }

    res
      .status(Constants.STATUS_CODES.OK)
      .json({ message: Messages.USER.USER_DELETED, success: true });
  } catch (err) {
    console.error(Messages.GENERAL.ERROR_EXECUTING_QUERY, err.stack);
    res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: Messages.GENERAL.INTERNAL_SERVER, success: false });
  }
};

module.exports = {
  getAllUsers,
  getAUser,
  updateUserDetail,
  deleteAUser,
  updateUserLogin,
};
