const express = require("express");
const {
  sequelize,
  models: { userLogin: UserLogin, userDetail: UserDetails },
} = require("docuvault-database");
const Messages = require("../../../constants/Messages");
const Constants = require("../../../constants/Constants");
const { Op } = require("sequelize");

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

module.exports = getAllUsers;
