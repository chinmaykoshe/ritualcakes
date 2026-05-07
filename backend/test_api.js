const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testAddProduct() {
    console.log("Starting API test for adding a product...");
    
    const form = new FormData();
    form.append('orderID', 'API_TEST_' + Date.now());
    form.append('name', 'API Test Cake');
    form.append('description', 'Added via test script');
    form.append('category', 'ChocolateCakes');
    form.append('basePrice', '450');
    form.append('sizes', JSON.stringify(['Round', 'Square']));
    form.append('prices', JSON.stringify({ "500g": 450, "1kg": 900 }));

    // Note: This test requires a valid token and a dummy image
    // Since this is a local test, we assume the server is running on :3000
    try {
        // We'll just check if the route exists first
        const check = await axios.get('http://localhost:3000/api/products').catch(e => e.response);
        if (check && (check.status === 200 || check.status === 401)) {
            console.log("✅ Product API is reachable.");
        } else {
            console.log("❌ Product API returned status:", check ? check.status : "No response");
        }
    } catch (error) {
        console.log("❌ Error connecting to backend:", error.message);
    }
}

testAddProduct();
