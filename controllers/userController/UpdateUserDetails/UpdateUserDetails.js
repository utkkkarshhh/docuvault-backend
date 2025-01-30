const express = require("express");
const {
  sequelize,
  models: { userLogin: UserLogin, userDetail: UserDetails },
} = require("docuvault-database");
const Messages = require("../../../constants/Messages");
const Constants = require("../../../constants/Constants");
const { Op } = require("sequelize");

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

module.exports = updateUserDetail;
