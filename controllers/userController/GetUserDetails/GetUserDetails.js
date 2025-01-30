const express = require("express");
const {
  sequelize,
  models: { userLogin: UserLogin, userDetail: UserDetails },
} = require("docuvault-database");
const Messages = require("../../../constants/Messages");
const Constants = require("../../../constants/Constants");
const { Op } = require("sequelize");

const getUserDetails = async (req, res) => {
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

module.exports = getUserDetails;
