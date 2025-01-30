const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const {
  sequelize,
  models: { userLogin: UserLogin, userLimit: UserLimit, documents: Document },
} = require("docuvault-database");
const Messages = require("../../../constants/Messages");
const Constants = require("../../../constants/Constants");
const multer = require("multer");
const env = require("../../../utils/dotenvConfig");
const { ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { storage } = require("../../../utils/firebase/firebase");

app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() }).single("file");

const uploadToFirebase = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          console.error("Multer error:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const { name, description, type, user_id } = req.body;
    const file = req.file;

    if (!name || !type || !file || !user_id) {
      return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
        message: Messages.FIREBASE.ERROR.MISSING_FIELDS,
        success: false,
      });
    }

    const userLimitObject = await UserLimit.findOne({ where: { user_id } });
    if (!userLimitObject || userLimitObject.limit <= 0) {
      return res.status(Constants.STATUS_CODES.FORBIDDEN).json({
        message: Messages.FIREBASE.ERROR.UPLOAD_LIMIT,
        success: false,
      });
    }

    const uniqueFileName = `${uuidv4()}-${file.originalname}`;
    const storageRef = ref(storage, uniqueFileName);
    const fileFormat = file.originalname.split(".").pop();

    await uploadBytes(storageRef, file.buffer, {
      contentType: file.mimetype,
    });

    const publicUrl = await getDownloadURL(storageRef);
    if (!publicUrl) {
      throw new Error("Failed to generate public URL for the uploaded file.");
    }

    const document = await Document.create({
      id: uuidv4(),
      name,
      description,
      type,
      link: publicUrl,
      format: fileFormat,
      user_id,
    });

    // Decrement user's upload limit
    userLimitObject.limit -= 1;
    await userLimitObject.save();

    res.status(Constants.STATUS_CODES.CREATED).json({
      message: Messages.FIREBASE.SUCCESS.UPLOAD_SUCCESS,
      success: true,
      data: document,
    });
  } catch (error) {
    console.error("Error in uploadToFirebase:", error);
    res.status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: Messages.FIREBASE.ERROR.UPLOAD_FAILED,
      success: false,
      error: error.message,
    });
  }
};

module.exports = uploadToFirebase;
