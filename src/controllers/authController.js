const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const generateOTP = require("../utils/otp");

// Helper to send email
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

// Register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const otp = generateOTP();

    // Store OTP in the user document (you can store it temporarily)
    user.otp = otp;
    await user.save();

    // Send OTP email
    const subject = "Your OTP for Email Verification";
    const html = `<p>Your OTP is: <strong>${otp}</strong></p><p>Please enter this OTP to verify your email address.</p>`;
    await sendEmail(email, subject, html);

    res.status(201).json({
      message: "User registered. Check your email for OTP to verify your account.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Verify Email
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.otp !== parseInt(otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.otp = undefined;  // Clear OTP after successful verification
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.isVerified) return res.status(403).json({ error: "Verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Return user data and token
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    user.resetToken = token;
    await user.save();

    const resetUrl = `http://localhost:${process.env.PORT}/apps/tipme/api/v1/authentication/forgot-password/${token}`;
    await sendEmail(email, "Reset Password", `<a href="${resetUrl}">Reset Password</a>`);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};