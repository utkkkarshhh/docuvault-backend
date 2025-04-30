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
  const { document_id } = req.body;
  const { user_id } = req.user;
  const transaction = await sequelize.transaction();

  try {
    if (!document_id || !user_id) {
      return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
        message: Messages.FIREBASE.ERROR.MISSING_FIELDS,
        success: false,
      });
    }

    const document = await Document.findByPk(document_id, { transaction });

    if (!document) {
      await transaction.rollback();
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        message: Messages.FIREBASE.ERROR.DOCUMENT_NOT_FOUND,
        success: false,
      });
    }

    if (document.user_id !== user_id) {
      await transaction.rollback();
      return res.status(Constants.STATUS_CODES.FORBIDDEN).json({
        message: Messages.FIREBASE.ERROR.USER_ID_DOES_NOT_MAPS,
        success: false,
      });
    }

    try {
      const storageRef = ref(storage, document.link);
      await deleteObject(storageRef);
    } catch (firebaseErr) {
      if (firebaseErr.code === "storage/object-not-found") {
        console.warn("Firebase file not found, proceeding with DB deletion.");
      } else {
        console.error("Unexpected Firebase error:", firebaseErr);
        throw firebaseErr;
      }
    }

    await document.destroy({ transaction });

    const currentUser = await UserLimit.findOne({
      where: { user_id },
      transaction,
    });

    if (currentUser) {
      currentUser.limit += 1;
      await currentUser.save({ transaction });
    }

    await transaction.commit();
    res.status(Constants.STATUS_CODES.OK).json({
      message: Messages.FIREBASE.SUCCESS.DELETED_SUCCESS,
      success: true,
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error in deleteFromFirebase:", error);
    res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: Messages.GENERAL.INTERNAL_SERVER, success: false });
  }
};

module.exports = deleteFromFirebase;
