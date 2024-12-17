const express = require("express");
const app = express();
const { sequelize } = require("../../db/sequelizeConnection");
const UserLogin = require("../../../docuvault-database/models/userLogin")(sequelize);
const UserDetails = require("../../../docuvault-database/models/userDetail")(sequelize);
const Messages = require("../../constants/Messages");
const Constants = require("../../constants/Constants");

app.use(express.json());

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserDetails.findAll();

    if (users.length === 0) {
      return res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ error: Messages.USER.NO_USERS_FOUND });
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
    const user = await UserDetails.findOne({
      where: { user_id },
    });

    if (!user) {
      return res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ message: Messages.USER.NO_USER_WITH_ID, success: false });
    }

    res.status(Constants.STATUS_CODES.OK).json({
      success: true,
      data : {user},
    });
  } catch (err) {
    console.error(Messages.GENERAL.ERROR_EXECUTING_QUERY, err.stack);
    res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: Messages.GENERAL.INTERNAL_SERVER, success: false });
  }
};

//Update User By ID
const updateAUser = async (req, res) => {
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
      return res
        .status(Constants.STATUS_CODES.BAD_REQUEST)
        .json({ error: Messages.VALIDATION.MISSING_REQUIRED_FIELDS, success: false });
    } else {
      return res
        .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: Messages.GENERAL.INTERNAL_SERVER, success: false });
    }
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
  updateAUser,
  deleteAUser,
};
