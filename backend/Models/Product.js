const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    orderID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    prices: {
        type: Object,
        default: {}
    },
    sizes: [{ type: String }],
    img: { type: String, required: true }, // This will store the Supabase URL
    category: { type: String, required: true }, // e.g., 'ChocolateCakes', 'Truffle', etc.
    related: [{ type: String }],
    rating: { type: Number, default: 4.5 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'reviews' }]
}, { timestamps: true });

const ProductModel = mongoose.model('products', ProductSchema);
module.exports = ProductModel;
