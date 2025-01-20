const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyOTP,
  forgotPassword,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

module.exports = router;