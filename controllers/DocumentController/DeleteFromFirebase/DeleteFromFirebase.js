const express = require("express");
const {
  sequelize,
  models: { userLogin: UserLogin, userLimit: UserLimit, documents: Document },
} = require("docuvault-database");
const Messages = require("../../../constants/Messages");
const Constants = require("../../../constants/Constants");
const env = require("../../../utils/dotenvConfig");
const { ref, deleteObject } = require("firebase/storage");
const { storage } = require("../../../utils/firebase/firebase");

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

module.exports = deleteFromFirebase;
