const express = require("express");
const app = express();
const { sequelize } = require("../../db/sequelizeConnection");
const User = require("../../models/users")(sequelize);
const Messages = require("../../constants/Messages");
const Constants = require("../../constants/Constants");

app.use(express.json());

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();

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
    const user = await User.findByPk(user_id);

    if (!user) {
      return res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ message: Messages.USER.NO_USER_WITH_ID, success: false });
    }

    res.status(Constants.STATUS_CODES.OK).json(user);
  } catch (err) {
    console.error(Messages.GENERAL.ERROR_EXECUTING_QUERY, err.stack);
    res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: Messages.GENERAL.INTERNAL_SERVER });
  }
};

// Update a user by ID
const updateAUser = async (req, res) => {
  const { user_id } = req.params;
  const { name, email } = req.body;

  if (!name && !email) {
    return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
      error: Messages.VALIDATION.ONE_FIELD_REQUIRED,
    });
  }

  try {
    const [updated] = await User.update(
      { name, email },
      {
        where: { user_id },
        returning: true,
      }
    );

    if (updated === 0) {
      return res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ error: Messages.USER.NO_USER_FOUND });
    }

    const updatedUser = await User.findByPk(user_id);
    res.status(Constants.STATUS_CODES.OK).json(updatedUser);
  } catch (err) {
    console.error(Messages.GENERAL.ERROR_EXECUTING_QUERY, err.stack);
    if (err.name === "SequelizeUniqueConstraintError") {
      res
        .status(Constants.STATUS_CODES.BAD_REQUEST)
        .json({ error: Messages.VALIDATION.EMAIL_ALREADY_EXISTS });
    } else if (err.name === "SequelizeValidationError") {
      res
        .status(Constants.STATUS_CODES.BAD_REQUEST)
        .json({ error: Messages.VALIDATION.MISSING_REQUIRED_FIELDS });
    } else {
      res
        .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ error: Messages.GENERAL.INTERNAL_SERVER });
    }
  }
};

// Delete a user by ID
const deleteAUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const deleted = await User.destroy({
      where: { user_id },
    });

    if (deleted === 0) {
      return res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ error: Messages.USER.NO_USER_FOUND });
    }

    res
      .status(Constants.STATUS_CODES.OK)
      .json({ message: Messages.USER.USER_DELETED });
  } catch (err) {
    console.error(Messages.GENERAL.ERROR_EXECUTING_QUERY, err.stack);
    res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: Messages.GENERAL.INTERNAL_SERVER });
  }
};

module.exports = {
  getAllUsers,
  getAUser,
  updateAUser,
  deleteAUser,
};
