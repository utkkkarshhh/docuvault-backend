const express = require("express");
const app = express();
const { Op } = require("sequelize");

const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;
};

const verifyOtp = async (req, res) => {
  const { optReceived } = req.body;
};

module.exports = { sendOtp, verifyOtp };
