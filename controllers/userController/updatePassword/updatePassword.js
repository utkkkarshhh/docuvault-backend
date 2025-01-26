const {
  sequelize,
  models: { userLogin: UserLogin, userDetail: UserDetails },
} = require("docuvault-database");
const bcrypt = require("bcrypt");
const Messages = require("../../../constants/Messages");
const Constants = require("../../../constants/Constants");

const updatePassword = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const { user_id } = req.params;

    const trimmedNewPassword = newPassword.trim();

    if (trimmedNewPassword.length < 8) {
      await transaction.rollback();
      return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: Messages.VALIDATION.PASSWORD_LENGTH_INVALID,
      });
    }

    const userLoginObject = await UserLogin.findOne({
      where: { user_id },
      transaction,
    });

    if (!userLoginObject) {
      await transaction.rollback();
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: Messages.USER.NO_USER_FOUND,
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      userLoginObject.password
    );

    if (!isCurrentPasswordValid) {
      await transaction.rollback();
      return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: Messages.VALIDATION.INCORRECT_CURRENT_PASSWORD,
      });
    }

    if (newPassword !== confirmNewPassword) {
      await transaction.rollback();
      return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: Messages.VALIDATION.NEW_PASSWORD_DONT_MATCH,
      });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      userLoginObject.password
    );
    if (isSamePassword) {
      await transaction.rollback();
      return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: Messages.VALIDATION.NEW_PASSWORD_CANNOT_BE_SAME,
      });
    }

    const hashedNewPassword = await bcrypt.hash(
      newPassword,
      Constants.AUTH.SALT_ROUNDS
    );

    // Update password
    await UserLogin.update(
      { password: hashedNewPassword },
      {
        where: { user_id },
        transaction,
      }
    );

    await transaction.commit();

    return res.status(Constants.STATUS_CODES.OK).json({
      success: true,
      message: Messages.VALIDATION.PASSWORD_UPDATED,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Password update error:", error);
    return res.status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: Messages.GENERAL.INTERNAL_SERVER,
    });
  }
};

module.exports = updatePassword;
