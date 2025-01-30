const express = require("express");
const app = express();
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
const sendEmail = require("../../../utils/email/sendEmail");

app.use(express.json());

const forgetPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(Constant.STATUS_CODES.BAD_REQUEST).json({
      success: false,
      message: Messages.VALIDATION.EMAIL_REQUIRED,
    });
  }

  try {
    const identifier = await UserLogin.findOne({ where: { email } });

    if (!identifier) {
      return res.status(Constant.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: Messages.VALIDATION.EMAIL_OR_USERNAME_NOT_EXISTS,
      });
    }

    const emailResponse = await sendEmail(
      "utkarshbhardwajmail@gmail.com",
      email,
      "Password Reset",
      "Password Reset Instructions",
      "<h1>Click the link below to reset your password</h1>"
    );

    if (emailResponse.success) {
      return res.status(Constant.STATUS_CODES.OK).json({
        success: true,
        message: emailResponse.message,
      });
    } else {
      return res.status(Constant.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: emailResponse.message,
      });
    }
  } catch (error) {
    console.error("Error during forget password:", error);
    return res.status(Constant.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: Messages.GENERAL.INTERNAL_SERVER,
    });
  }
};

module.exports = forgetPassword;
