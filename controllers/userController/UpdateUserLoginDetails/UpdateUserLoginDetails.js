const express = require("express");
const app = express();
const {
  sequelize,
  models: { userLogin: UserLogin, userDetail: UserDetails },
} = require("docuvault-database");
const Messages = require("../../../constants/Messages");
const Constants = require("../../../constants/Constants");

app.use(express.json());

const updateUserLogin = async (req, res) => {
  const { username, email, is_subscribed_to_emails } = req.body;
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
      { username, email, is_subscribed_to_emails },
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

module.exports = updateUserLogin;
