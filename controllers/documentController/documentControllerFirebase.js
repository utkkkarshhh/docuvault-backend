const express = require("express");
const app = express();
const { sequelize } = require("../../db/sequelizeConnection");
const User = require("../../models/users")(sequelize);
const Document = require("../../models/documents")(sequelize);
const Messages = require("../../constants/Messages");
const Constants = require("../../constants/Constants");
const multer = require("multer");
const env = require("../../utils/dotenvConfig");

env();
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() }).single("document");

const uploadToFirebase = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.GENERAL.INTERNAL_SERVER, success: false });
    }
  });

  const { name, description, type } = req.body;
  const file = req.file;

  if (!name || !type || !file) {
    return res
      .status(Constants.STATUS_CODES.BAD_REQUEST)
      .json({ message: Messages.AWS.ERROR.MISSING_FIELDS, success: false });
  }

  try {
    const fileName = `${Date.now()}-${file.originalname}`;

    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    blobStream.on("error", (error) => {
      console.error(Messages.GENERAL.INTERNAL_SERVER, error);
      res
        .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.GENERAL.INTERNAL_SERVER, success: false });
    });
    blobStream.on("finish", async () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
        process.env.BUCKET_NAME
      }/o/${encodeURIComponent(fileName)}?alt=media`;
    });

    try {
      const document = await Document.create({
        document_name: name,
        document_description: description,
        document_type: type,
        document_link: publicUrl,
      });
      res
        .status(Constants.STATUS_CODES.CREATED)
        .json({ message: Messages.AWS.SUCCESS.UPLOAD_SUCCESS, success: true });
    } catch (dbError) {
      console.error(Messages.DATABASE.DATABASE_ERROR);
      res
        .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.DATABASE.DATABASE_ERROR, success: false });
    }
    blobStream.end(file.buffer);
  } catch (error) {
    console.error(Messages.GENERAL.INTERNAL_SERVER, error);
    res.status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: Messages.GENERAL.ERROR_EXECUTING_QUERY,
      success: false,
    });
  }
};

const downloadFromFirebase = (req, res) => {
  const { document_id } = req.body;

  if (!document_id) {
    res
      .status(Constants.STATUS_CODES.BAD_REQUEST)
      .json({ message: Messages.AWS.ERROR.MISSING_FIELDS, success: false });
  }

  try {
  } catch (error) {
    console.error(Messages.GENERAL.INTERNAL_SERVER);
    res
      .status()
      .json({ message: Messages.GENERAL.INTERNAL_SERVER, success: false });
  }
};

const deleteFromFirebase = (req, res) => {
  const { document_id, user_id } = req.body;
  try {
  } catch (error) {}
};

module.exports = { uploadToFirebase, downloadFromFirebase, deleteFromFirebase };
