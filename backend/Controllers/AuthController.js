const UserModel = require("../Models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const transporter = require('../Controllers/mailer'); 
const { BRAND_EMAIL, formatDate, renderBrandedEmail } = require('./emailTemplates');
const ADMIN_EMAIL = "ritualcakes2019@gmail.com";

const signup = async (req, res) => {
    try {
        let { name, surname, email, password, address, mobile, dob, role } = req.body;
        email = email.toLowerCase();
        role = email === ADMIN_EMAIL ? "admin" : role || "user";
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "User already exists...", success: false });
        }
        const userModel = new UserModel({ name, surname, email, password, address, mobile, dob, role });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        const signupEmailHtml = renderBrandedEmail({
            preview: "Your Ritual Cakes account is ready.",
            eyebrow: "Welcome",
            title: "Welcome to Ritual Cakes",
            intro: `Hi ${userModel.name}, your account is ready. We are happy to be part of your celebrations.`,
            body: "<p style=\"margin:0 0 12px;\">You can now save your details, place orders, and track your cake requests from your account.</p>",
            details: [
                ["Name", `${userModel.name} ${userModel.surname}`],
                ["Email", userModel.email],
                ["Mobile", userModel.mobile],
                ["Date of Birth", formatDate(userModel.dob)],
                ["Address", userModel.address],
            ],
        });
        const mailOptionsUser = {
            from: BRAND_EMAIL,
            to: userModel.email,
            subject: `Welcome to Ritual Cakes`,
            html: signupEmailHtml,
        };
        const mailOptionsAdmin = {
            from: BRAND_EMAIL,
            to: BRAND_EMAIL,
            subject: `New signup: ${userModel.email}`,
            html: renderBrandedEmail({
                preview: "A new customer signed up on Ritual Cakes.",
                eyebrow: "New signup",
                title: "New Customer Account",
                intro: `${userModel.name} ${userModel.surname} created a Ritual Cakes account.`,
                details: [
                    ["Name", `${userModel.name} ${userModel.surname}`],
                    ["Email", userModel.email],
                    ["Mobile", userModel.mobile],
                    ["Date of Birth", formatDate(userModel.dob)],
                    ["Address", userModel.address],
                ],
            }),
        };
        try {
            await transporter.sendMail(mailOptionsUser);
            console.log('Email sent to user successfully');
        } catch (error) {
            console.error('Error sending email to user:', error.message);
        }

        try {
            await transporter.sendMail(mailOptionsAdmin);
            console.log('Email sent to admin successfully');
        } catch (error) {
            console.error('Error sending email to admin:', error.message);
        }
        res.status(201).json({ message: "Signup successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
        console.error('Signup error:', err.message);
    }
};
const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required.", success: false });
        }
        email = email.toLowerCase();
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "New Email detected", success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(401).json({ message: "Invalid credentials.", success: false });
        }
        const role = user.email === ADMIN_EMAIL ? "admin" : user.role;
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role },
            process.env.JWT_SECRET,
            { expiresIn: "1w" }
        );
        res.status(200).json({
            message: "Login successfully",
            success: true,
            token: jwtToken,
            email: user.email,
            role,
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
const getUserByEmail = async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ message: "No token provided", success: false });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        res.status(200).json({
            success: true,
            name: user.name,
            surname: user.surname,
            email: user.email,
            mobile: user.mobile,
            dob: user.dob,
            address: user.address,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
module.exports = {
    signup,
    login,
    getUserByEmail,
};
