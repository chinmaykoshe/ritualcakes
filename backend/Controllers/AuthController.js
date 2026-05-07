const UserModel = require("../Models/User");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const transporter = require('../Controllers/mailer'); 
const ADMIN_EMAIL = "ritualcake2019@gmail.com";

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
        const signupEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Signup Confirmation</title>
            <style>
                body {
                    padding: 25px;
                    font-family: Arial, sans-serif;
                    background-color: rgb(255, 228, 208);
                    color: rgb(44, 44, 44);
                    line-height: 1.6;
                }
                h1, h3 {
                    color: rgb(72, 37, 11);
                }
                p {
                    margin: 10px 0;
                }
                table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 20px 0;
                    background-color: #fff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                    border: 1px solid rgb(77, 77, 77);
                }
                th {
                    background-color: rgb(72, 37, 11);
                    color: white;
                }
                strong {
                    color: rgb(72, 37, 11);
                }
                footer {
                    margin-top: 20px;
                    font-size: 0.9em;
                    color: rgb(77, 77, 77);
                    text-align: center;
                }
                a {
                    color: rgb(72, 37, 11);
                }
            </style>
        </head>
        <body>
            <h1>Welcome to RITUAL CAKES!</h1>
            <p>Dear <strong>${userModel.name}</strong>,</p>
            <p>Thank you for signing up at RITUAL CAKES. We are thrilled to have you on board!</p>
            <h3>Your Details:</h3>
            <table>
                <tbody>
                    <tr>
                        <td><strong>Name:</strong></td>
                        <td>${userModel.name} ${userModel.surname}</td>
                    </tr>
                    <tr>
                        <td><strong>Email:</strong></td>
                        <td>${userModel.email}</td>
                    </tr>
                    <tr>
                        <td><strong>Address:</strong></td>
                        <td>${userModel.address}</td>
                    </tr>
                    <tr>
                        <td><strong>Mobile:</strong></td>
                        <td>${userModel.mobile}</td>
                    </tr>
                    <tr>
                        <td><strong>Date of Birth:</strong></td>
                        <td>${new Date(userModel.dob).toDateString()}</td>
                    </tr>
                </tbody>
            </table>
            <p>If you have any questions, feel free to <a href="mailto:support@ritualcakes.com">contact us</a>.</p>
            <footer>
                <p>Sincerely,<br>The RITUAL CAKES Team</p>
                <p>&copy; ${new Date().getFullYear()} RITUAL CAKES. All rights reserved.</p>
            </footer>
        </body>
        </html>
        `;
        const mailOptionsUser = {
            from: 'ritualcakes2019@gmail.com',
            to: userModel.email,
            subject: `Welcome to RITUAL CAKES`,
            html: signupEmailHtml,
        };
        const mailOptionsAdmin = {
            from: 'ritualcakes2019@gmail.com',
            to: 'ritualcakes2019@gmail.com',
            subject: `New SIGN UP FROM ${userModel.email}`,
            html: signupEmailHtml,
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
