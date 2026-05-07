const express = require('express');
const router = express.Router();
const Product = require('../Models/Product');
const ensureAuthenticated = require('./Middlewares/auth');
const multer = require('multer');
const supabase = require('../supabase');
const upload = multer({ storage: multer.memoryStorage() });

// GET all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// POST a new product with image upload (Admin only)
router.post('/products', ensureAuthenticated, upload.single('image'), async (req, res) => {
    try {
        console.log("DEBUG: POST /products - Request received");
        
        // Diagnostic: Check if bucket exists
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        console.log("DEBUG: Available buckets:", buckets?.map(b => b.name));
        if (bucketError) console.error("DEBUG: List buckets error:", bucketError);

        const { orderID, name, description, basePrice, category } = req.body;
        
        if (!orderID || !name || !category) {
            console.log("DEBUG: Missing required fields:", { orderID, name, category });
            return res.status(400).json({ message: "Missing required fields (orderID, name, category)" });
        }

        let imageUrl = "";

        if (req.file) {
            console.log("DEBUG: Uploading image:", req.file.originalname);
            const file = req.file;
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${orderID}-${Date.now()}.${fileExt}`;
            const filePath = `products/${fileName}`;

            const { data, error: uploadError } = await supabase.storage
                .from('ritualcakes')
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true
                });

            if (uploadError) {
                console.error("DEBUG: Supabase upload error:", uploadError);
                return res.status(500).json({ message: "Supabase upload failed", error: uploadError.message });
            }

            const { data: publicUrlData } = supabase.storage
                .from('ritualcakes')
                .getPublicUrl(filePath);

            imageUrl = publicUrlData.publicUrl;
        } else {
            console.log("DEBUG: No file provided in request");
            return res.status(400).json({ message: "Image file is required" });
        }

        // Parse prices and sizes safely
        let finalPrices = {};
        let finalSizes = [];
        try {
            if (typeof req.body.prices === 'string') {
                finalPrices = JSON.parse(req.body.prices);
            } else if (req.body.prices) {
                finalPrices = req.body.prices;
            }
            
            if (typeof req.body.sizes === 'string') {
                finalSizes = JSON.parse(req.body.sizes);
            } else if (req.body.sizes) {
                finalSizes = req.body.sizes;
            }
        } catch (parseErr) {
            console.warn("DEBUG: Failed to parse prices or sizes", parseErr.message);
        }

        const newProduct = new Product({
            orderID,
            name,
            description: description || "",
            prices: finalPrices,
            sizes: finalSizes,
            img: imageUrl,
            category
        });

        await newProduct.save();
        console.log("DEBUG: Product saved successfully:", orderID);
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error("DEBUG: CRITICAL ERROR in POST /products:", error);
        res.status(500).json({ 
            message: 'Internal Server Error', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// UPDATE a product
router.put('/products/:id', ensureAuthenticated, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

// DELETE a product
router.delete('/products/:id', ensureAuthenticated, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

module.exports = router;
