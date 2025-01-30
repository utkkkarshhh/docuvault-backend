const express = require("express");
const app = express();
const {
  sequelize,
  models: { userLogin: UserLogin, userDetail: UserDetails },
} = require("docuvault-database");
const Messages = require("../../../constants/Messages");
const Constants = require("../../../constants/Constants");
const { Op } = require("sequelize");

const deleteUser = async (req, res) => {
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

module.exports = deleteUser;
