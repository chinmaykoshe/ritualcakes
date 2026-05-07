const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../Controllers/mailer");
const User = require("../Models/User");
const { BRAND_EMAIL, getFrontendUrl, renderBrandedEmail } = require("../Controllers/emailTemplates");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const RESET_TOKEN_EXPIRATION = "1h";

router.post("/forgot-password", async (req, res) => {
  const email = req.body.email?.toLowerCase();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: RESET_TOKEN_EXPIRATION,
    });
    const resetLink = `${getFrontendUrl()}/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: BRAND_EMAIL,
      to: email,
      subject: "Reset your Ritual Cakes password",
      html: renderBrandedEmail({
        preview: "Use this secure link to reset your Ritual Cakes password.",
        eyebrow: "Account security",
        title: "Reset Your Password",
        intro: `Hi ${user.name || "there"}, we received a request to reset your Ritual Cakes account password.`,
        body: "<p style=\"margin:0 0 12px;\">This secure link is valid for 1 hour. If you did not request this, you can safely ignore this email and your password will stay unchanged.</p>",
        cta: {
          href: resetLink,
          label: "Reset Password",
        },
        footerNote: "For your security, never share this email or password reset link with anyone.",
      }),
    });

    user.passwordResetSent = true;
    await user.save();

    res.status(200).json({ message: "Reset password link sent. Please check your email." });
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
    user.passwordResetSent = false;
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
