const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../Controllers/mailer");
const User = require("../Models/User");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const RESET_TOKEN_EXPIRATION = "1h";
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://ritualcakes.vercel.app';

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.passwordResetSent) {
      return res.status(400).json({ message: "Password reset email already sent" });
    }
    const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: RESET_TOKEN_EXPIRATION,
    });
    const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: "no-reply@ritualcakes.com",
      to: email,
      subject: "Password Reset Request at Ritual Cakes",
      html: `
<!DOCTYPE html>
<html>
  <head>
    <title>Password Reset</title>
    <style>
      body {
        padding: 25px;
        font-family: Arial, sans-serif;
        background-color: rgb(255, 228, 208);
        color: rgb(44, 44, 44);
        line-height: 1.6;
      }

      h2 {
        color: rgb(72, 37, 11);
      }

      p {
        margin: 10px 0;
      }

      .btn {
        display: inline-block;
        padding: 10px 20px;
        background-color: rgb(255, 190, 141);
        color: white;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;
        text-align: center;
      }

      .btn:hover {
        background-color: rgb(255, 170, 105);
      }

      footer {
        margin-top: 20px;
        font-size: 0.9em;
        color: rgb(77, 77, 77);
        text-align: center;
      }

    </style>
  </head>
  <body>
    <h2>Password Reset</h2>
    <p>Dear ${user.name},</p>
    <p>You have requested to reset your password at Ritual Cakes. Click the button below to reset your password:</p>
    <a href="${resetLink}" class="btn">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thank you,</p>
    <p>The Ritual Cakes Team</p>
    <footer>
      <p>Sincerely,<br> Ritual Cakes </p>
      <p>&copy; ${new Date().getFullYear()} Ritual Cakes. All rights reserved.</p>
    </footer>
  </body>
</html>
        `,
    });

    user.passwordResetSent = true;
    await user.save();

    res.status(200).json({ message: "Reset password link sent to your email.Please check you mail" });
  } catch (error) {
    console.error("FORGOT-PASSWORD ERROR:", error);
    res.status(500).json({ message: "Error sending reset link", error: error.message || error });
  }
});
router.post("/reset-password/:token", async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params; 
  
  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  const trimmedPassword = newPassword.trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("DEBUG: Resetting password for user:", userId);
    console.log("DEBUG: Password being tested:", `"${trimmedPassword}"`);
    
    const hasLetter = /[A-Za-z]/.test(trimmedPassword);
    const hasNumber = /\d/.test(trimmedPassword);
    const isLongEnough = trimmedPassword.length >= 8;
    const isValid = hasLetter && hasNumber && isLongEnough;

    console.log("DEBUG: hasLetter:", hasLetter, "hasNumber:", hasNumber, "isLongEnough:", isLongEnough);
    console.log("DEBUG: Final isValid:", isValid);

    if (!isValid) {
      return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one letter and one number" });
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    res.status(500).json({ message: "Error resetting password", error });
  }
});

module.exports = router;
