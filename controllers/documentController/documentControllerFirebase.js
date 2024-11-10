const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../../db/sequelizeConnection");
const User = require("../../models/users")(sequelize);
const Document = require("../../models/documents")(sequelize);
const Messages = require("../../constants/Messages");
const Constants = require("../../constants/Constants");
const multer = require("multer");
const env = require("../../utils/dotenvConfig");
const {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");
const { storage } = require("../../utils/firebase/firebase");

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

    // Check the upload limit ('limit') for the user, if greater than 0 ,proceed, else return a repsonse that the user has reached upload limit
    const currentUser = await User.findByPk(user_id);
    const uniqueFileName = `${uuidv4()}-${file.originalname}`;
    const storageRef = ref(storage, uniqueFileName);

    if (currentUser.limit > 0) {
      await uploadBytes(storageRef, file.buffer, {
        contentType: file.mimetype,
      });

      const publicUrl = await getDownloadURL(storageRef);

      if (publicUrl) {
        const document = await Document.create({
          document_name: name,
          document_description: description,
          document_type: type,
          document_link: publicUrl,
          user_id: user_id,
        });

        currentUser.limit -= 1;
        await currentUser.save();

        res.status(Constants.STATUS_CODES.CREATED).json({
          message: Messages.FIREBASE.SUCCESS.UPLOAD_SUCCESS,
          success: true,
          document,
        });
      } else {
        res.status(Constants.STATUS_CODES.FORBIDDEN).json({
          message: Messages.FIREBASE.ERROR.UPLOAD_FAILED,
          success: false,
        });
      }
    } else {
      res.status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: Messages.FIREBASE.ERROR.UPLOAD_LIMIT,
        success: false,
      });
    }
  } catch (error) {
    console.error("Error in uploadToFirebase:", error);
    res.status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: error.message || Messages.GENERAL.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
};

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

const deleteFromFirebase = async (req, res) => {
  const { document_id, user_id } = req.body;
  try {
    if (!document_id || !user_id) {
      return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
        message: Messages.FIREBASE.ERROR.MISSING_FIELDS,
        success: false,
      });
    }

    const document = await Document.findByPk(document_id);

    if (document.user_id != user_id) {
      return res.status(Constants.STATUS_CODES.FORBIDDEN).json({
        message: Messages.FIREBASE.ERROR.USER_ID_DOES_NOT_MAPS,
        success: false,
      });
    }

    if (!document) {
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        message: Messages.FIREBASE.ERROR.DOCUMENT_NOT_FOUND,
        success: false,
      });
    }

    const storageRef = ref(storage, document.document_link);
    await deleteObject(storageRef);

    await document.destroy();

    const currentUser = await User.findByPk(user_id);
    if (!currentUser) {
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        message: Messages.FIREBASE.ERROR.DELETION_FALIED,
        success: false,
      });
    }

    currentUser.limit += 1;
    await currentUser.save();

    res.status(Constants.STATUS_CODES.OK).json({
      message: Messages.FIREBASE.SUCCESS.DELETED_SUCCESS,
      success: true,
    });
  } catch (error) {
    console.error("Error in deleteFromFirebase:", error);
    res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.GENERAL.INTERNAL_SERVER, success: false });
  }
};

const getAllDocumentsForUser = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
      message: Messages.GENERAL.MISSING_USER_ID,
      success: false,
    });
  }

  try {
    const currentUser = await User.findByPk(user_id);
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

module.exports = {
  uploadToFirebase,
  downloadFromFirebase,
  deleteFromFirebase,
  getAllDocumentsForUser
};
