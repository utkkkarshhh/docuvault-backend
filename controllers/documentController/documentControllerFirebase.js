const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const {
  sequelize,
  models: {
    userLogin: UserLogin,
    userLimit: UserLimit,
    documents: Document,
    publicVisibility: PublicVisibilty,
  },
} = require("docuvault-database");
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

  const transaction = await sequelize.transaction(); // Start transaction

  try {
    // Validate request
    if (!document_id || !user_id) {
      return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
        message: Messages.FIREBASE.ERROR.MISSING_FIELDS,
        success: false,
      });
    }

    // Find the document in the database
    const document = await Document.findByPk(document_id, { transaction });

    if (!document) {
      await transaction.rollback();
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        message: Messages.FIREBASE.ERROR.DOCUMENT_NOT_FOUND,
        success: false,
      });
    }

    // Verify user ownership of the document
    if (document.user_id !== user_id) {
      await transaction.rollback();
      return res.status(Constants.STATUS_CODES.FORBIDDEN).json({
        message: Messages.FIREBASE.ERROR.USER_ID_DOES_NOT_MAPS,
        success: false,
      });
    }

    // Delete the file from Firebase Storage
    const storageRef = ref(storage, document.link); // Ensure `document.link` is a valid file path
    await deleteObject(storageRef).catch(async (err) => {
      console.error("Error deleting file from Firebase:", err);
      await transaction.rollback();
      throw new Error(Messages.FIREBASE.ERROR.DELETION_FAILED);
    });

    // Delete the document from the database
    await document.destroy({ transaction });

    // Update the user's document limit
    const currentUser = await UserLimit.findByPk(user_id, { transaction });
    if (currentUser) {
      currentUser.limit += 1;
      await currentUser.save({ transaction });
    }

    // Commit transaction
    await transaction.commit();

    // Respond with success
    res.status(Constants.STATUS_CODES.OK).json({
      message: Messages.FIREBASE.SUCCESS.DELETED_SUCCESS,
      success: true,
    });
  } catch (error) {
    await transaction.rollback(); // Roll back transaction on error
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
  getAllDocumentsForUser,
};
