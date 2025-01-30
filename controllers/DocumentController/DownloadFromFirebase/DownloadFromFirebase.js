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
const { storage } = require("../../../utils/firebase/firebase");

app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() }).single("file");

const downloadFromFirebase = (req, res) => {
  const { document_id } = req.body;

  if (!document_id) {
    res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
      message: Messages.FIREBASE.ERROR.MISSING_FIELDS,
      success: false,
    });
  }

  try {
  } catch (error) {
    console.error(Messages.GENERAL.INTERNAL_SERVER);
    res
      .status()
      .json({ message: Messages.GENERAL.INTERNAL_SERVER, success: false });
  }
};

module.exports = downloadFromFirebase;
