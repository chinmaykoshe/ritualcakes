const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address'],
        set: (email) => email.toLowerCase() 
    },
    mobile: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please provide a valid 10-digit mobile number']
    },
    dob: { type: Date },
    address: { type: String, required: true },
    password: { type: String, required: true },
    cartProducts: [{
        orderID: { type: String, required: true }, 
        name: { type: String },
        quantity: { type: Number, default: 1 },
        weight: { type: String },
        shape: { type: String },
        img: { type: String },
        price: { type: Number }, 
    }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, 
    passwordResetSent: { type: Boolean, default: false },
}, { timestamps: true });

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
