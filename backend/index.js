const express = require('express');
const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
    console.error("Dotenv config error:", result.error);
} else {
    console.log("Dotenv loaded successfully. Keys found:", Object.keys(result.parsed || {}));
}

require('./Models/db'); 
const AuthRouter = require('./Routes/AuthRouter');
const CartRouter = require('./Routes/CartRouter');
const orderRoutes = require('./Routes/orderRoutes');
const customizeRoutes = require('./Routes/customizeRoutes');
const userRoutes = require('./Routes/userRoutes');
const reviewRouter = require('./Routes/reviewRouter');
const resetpassroute = require('./Routes/ResetPassRoute');
const productRoutes = require('./Routes/productRoutes');
const app = express();

// CORS configuration (development-friendly)
// Allows any origin during development to prevent CORS issues.
// In production, replace with a whitelist of allowed domains.
const cors = require('cors');
app.use(cors({
  origin: true, // reflect request origin
  credentials: true,
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Root route for testing
app.get("/", (req, res) => {
    res.json({ message: "CORS headers are working!" });
});

// Register routes
app.use('/api', userRoutes);// User routes
app.use('/auth', AuthRouter);// Authentication routes
app.use('/api', CartRouter);// Cart routes
app.use('/api', orderRoutes);// Order routes
app.use('/api', customizeRoutes);// Customization routes
app.use("/api", reviewRouter);// Review routes
app.use('/api', resetpassroute);
app.use('/api', productRoutes);

// Debug: Print all routes
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(`DEBUG: Registered Route: ${r.route.path}`);
  }
});


// Handle favicon requests to prevent unnecessary errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
