const express = require("express");
const app = express();
const {
  sequelize,
  models: { userLogin: UserLogin, userLimit: UserLimit, documents: Document },
} = require("docuvault-database");
const Messages = require("../../../constants/Messages");
const Constants = require("../../../constants/Constants");
const multer = require("multer");
const env = require("../../../utils/dotenvConfig");

app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() }).single("file");

const getAllDocumentsForUser = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
      message: Messages.GENERAL.MISSING_USER_ID,
      success: false,
    });
  }

  try {
    const currentUser = await UserLogin.findByPk(user_id);

    if (currentUser) {
      const documents = await Document.findAll({
        where: { user_id: currentUser.user_id },
      });

      return res.status(Constants.STATUS_CODES.OK).json({
        message: Messages.FIREBASE.SUCCESS.FETCH_SUCCESS,
        success: true,
        documents,
      });
    } else {
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        message: Messages.GENERAL.USER_NOT_FOUND,
        success: false,
      });
    }
  } catch (error) {
    console.error("Error getting user's documents:", error);
    return res.status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: Messages.GENERAL.INTERNAL_SERVER,
      success: false,
    });
  }
};

module.exports = getAllDocumentsForUser;
