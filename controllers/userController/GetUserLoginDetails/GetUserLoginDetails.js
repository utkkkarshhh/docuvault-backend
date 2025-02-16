const {
  sequelize,
  models: { userLogin: UserLogin, userDetail: UserDetails },
} = require("docuvault-database");
const Messages = require("../../../constants/Messages");
const Constants = require("../../../constants/Constants");

const getUserLoginDetails = async (req, res) => {
  const { user_id } = req.params;

  try {
    const userLoginObject = await UserLogin.findOne({
      where: { user_id },
      attributes: ["user_id", "email", "username", "is_subscribed_to_emails"],
      raw: true
    });

    if (!userLoginObject) {
      return res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ message: Messages.USER.NO_USER_WITH_ID, success: false });
    }

    return res.status(Constants.STATUS_CODES.OK).json({
      success: true,
      data: userLoginObject,
    });
  } catch (error) {
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: Messages.GENERAL.INTERNAL_SERVER, success: false });
  }
};

module.exports = getUserLoginDetails;
