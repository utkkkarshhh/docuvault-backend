const express = require("express");
const app = express();
const { sequelize } = require("../../db/sequelizeConnection");
const User = require("../../models/users")(sequelize);
const Document = require("../../models/documents")(sequelize);
const Messages = require("../../constants/Messages");
const Constants = require("../../constants/Constants");
const multer = require("multer");
const s3 = require("../../utils/aws/s3");
const env = require("../../utils/dotenvConfig");

env();
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() }).single("document");

const uploadToAWS = async (req, res) => {
  const { name, description, type, user_id } = req.body;
  const file = req.file;

  if (!file || !name || !type) {
    return res
      .status(Constants.STATUS_CODES.BAD_REQUEST)
      .json({ message: Messages.AWS.ERROR.MISSING_FIELDS, success: false });
  }

  const params = {
    Bucket: Constants.AWS.S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  try {
    const user = await User.findByPk(user_id);

    if (!user) {
      res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ message: Messages.AWS.ERROR.USER_NOT_FOUND, success: false });
    }

    if (user.limti <= 0) {
      res
        .status(Constants.STATUS_CODES.FORBIDDEN)
        .json({ message: Messages.AWS.ERROR.UPLOAD_LIMIT, success: false });
    }

    const uploadResult = await s3.upload(params).promise();
    const document = await Document.create({
      document_name: name,
      document_description: description,
      document_type: type,
      document_link: uploadResult.Location,
      user_id: user_id,
    });

    await user.update({ limit: user.limit - 1 });

    res.status(Constants.STATUS_CODES.CREATED).json({
      message: Messages.AWS.SUCCESS.UPLOAD_SUCCESS,
      success: true,
      document,
    });
  } catch (error) {
    console.error(Messages.GENERAL.INTERNAL_SERVER, error);
    res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.GENERAL.INTERNAL_SERVER, success: false });
  }
};

const downloadFromAWS = (req, res) => {
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

const deleteFromAWS = (req, res) => {
  const { document_id, user_id } = req.body;
  try {
  } catch (error) {}
};

module.exports = { uploadToFirebase, downloadFromAWS, downloadFromAWS };
