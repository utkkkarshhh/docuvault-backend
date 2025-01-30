const express = require("express");
const app = express();
const Messages = require("../../../constants/Messages");
const Constant = require("../../../constants/Constants");

app.use(express.json());

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

module.exports = logoutUser;
