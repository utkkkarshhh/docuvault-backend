const getUserLoginDetails = require("./userController/GetUserLoginDetails/GetUserLoginDetails");
const updatePassword = require("./userController/UpdatePassword/UpdatePassword");
const updateUserLogin = require("./userController/UpdateUserLoginDetails/UpdateUserLoginDetails");
const getUserDetails = require("./userController/GetUserDetails/GetUserDetails");
const updateUserDetail = require("./userController/UpdateUserDetails/UpdateUserDetails");
const deleteUser = require("./userController/DeleteUser/DeleteUser");
const getAllUsers = require("./userController/GetAllUsers/GetAllUsers");

module.exports = {
  getUserLoginDetails,
  updatePassword,
  updateUserLogin,
  getUserDetails,
  updateUserDetail,
  deleteUser,
  getAllUsers,
};
