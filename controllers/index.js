// Auth Routes
const registerUser = require("./AuthController/RegisterUser/RegisterUser");
const userLogin = require("./AuthController/LoginUser/LoginUser");
const logoutUser = require("./AuthController/LogoutUser/LogoutUser");
const forgetPassword = require("./AuthController/ForgetPassword/ForgetPassword");

// User Routes
const getUserLoginDetails = require("./UserController/GetUserLoginDetails/GetUserLoginDetails");
const updatePassword = require("./UserController/UpdatePassword/UpdatePassword");
const updateUserLogin = require("./UserController/UpdateUserLoginDetails/UpdateUserLoginDetails");
const getUserDetails = require("./UserController/GetUserDetails/GetUserDetails");
const updateUserDetail = require("./UserController/UpdateUserDetails/UpdateUserDetails");
const deleteUser = require("./UserController/DeleteUser/DeleteUser");
const getAllUsers = require("./UserController/GetAllUsers/GetAllUsers");

// Document Routes
const uploadToFirebase = require("./DocumentController/UploadToFirebase/UploadToFirebase");
const downloadFromFirebase = require("./DocumentController/DownloadFromFirebase/DownloadFromFirebase");
const deleteFromFirebase = require("./DocumentController/DeleteFromFirebase/DeleteFromFirebase");
const getAllDocumentsForUser = require("./DocumentController/GetAllUserDocuments/GetAllUserDocuments");
const convertDocument = require("./DocumentController/DocumentConversionController/DocumentConversionController");

module.exports = {
  getUserLoginDetails,
  updatePassword,
  updateUserLogin,
  getUserDetails,
  updateUserDetail,
  deleteUser,
  getAllUsers,
  registerUser,
  userLogin,
  logoutUser,
  forgetPassword,
  uploadToFirebase,
  downloadFromFirebase,
  deleteFromFirebase,
  getAllDocumentsForUser,
  convertDocument,
};
