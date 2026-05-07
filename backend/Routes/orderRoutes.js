const express = require('express');
const router = express.Router();
const OrderModel = require('../Models/Order');
console.log("DEBUG: orderRoutes.js loaded");

const UserModel = require('../Models/User');
const ensureAuthenticated = require('./Middlewares/auth'); 
const transporter = require('../Controllers/mailer'); 
const getUserOrders = async (req, res, next) => {
  try {
    const { userEmail } = req.params;
    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }

    const orders = await OrderModel.find({ userEmail }).sort({ createdAt: -1 });
    req.userOrders = orders;
    next();
  } catch (error) {
    console.error('Error fetching orders for user', req.params.userEmail, error.message);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};
router.get('/orders', ensureAuthenticated, async (req, res) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

router.post('/orders', ensureAuthenticated, async (req, res) => {
  console.log("DEBUG: POST /api/orders received");
  try {
    const {
      userEmail,
      orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      cakeMessage,
      orderDate,
      orderTime,
    } = req.body;
    
    console.log("DEBUG: Data extracted:", { userEmail, totalAmount, paymentMethod });

    if (!userEmail || !orderItems || !totalAmount || !deliveryAddress || !paymentMethod || !orderDate) {
      console.log("DEBUG: Missing fields validation failed");
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const userEmailNormalized = userEmail.toLowerCase();
    console.log("DEBUG: Looking for user:", userEmailNormalized);
    const user = await UserModel.findOne({ email: userEmailNormalized });
    
    if (!user) {
      console.log("DEBUG: User not found in DB");
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log("DEBUG: User found:", user.name);
    const userName = `${user.name} ${user.surname}`;
    const newOrder = new OrderModel({
      userEmail: userEmailNormalized,
      orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      cakeMessage,
      orderDate,
      orderTime,
      status: 'Pending',
      createdAt: new Date(),
    });
    await newOrder.save();
    const orderDetailsHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Order Confirmation</title>
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
        <h1>Thank You for Your Order!</h1>
        <p>Your order <strong>${newOrder._id}</strong> has been recived and is being processed.</p>
        <p><strong>Order Number:</strong> ${newOrder._id}</p>
        <h3>Orderer's Information:</h3>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <h3>Order Details:</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${orderItems.map((item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${item.price}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
        <p><strong>Total:</strong> ₹${totalAmount}</p>
        <h3>Shipping Address:</h3>
        <p>${deliveryAddress}</p>
        <p>If you have any questions, feel free to <a href="mailto:ritualcakes2019@gmail.com">contact us</a>.</p>
        <footer>
          <p>Sincerely,<br> Ritual Cakes </p>
          <p>&copy; ${new Date().getFullYear()} Ritual Cakes. All rights reserved.</p>
        </footer>
      </body>
    </html>`;
    const mailOptionsUser = {
      from: 'ritualcakes2019@gmail.com',
      to: userEmail,
      subject: `Order Confirmation: ${newOrder._id}`,
      html: orderDetailsHtml,
    };
    const mailOptionsAdmin = {
      from: 'ritualcakes2019@gmail.com',
      to: 'ritualcakes2019@gmail.com',
      subject: `New Order Placed by ${user.name} ${user.surname} with order id ${newOrder._id}`,
      html: orderDetailsHtml,
    };
    await transporter.sendMail(mailOptionsUser);
    await transporter.sendMail(mailOptionsAdmin);
    res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
router.get('/orders/:userEmail', ensureAuthenticated, getUserOrders, (req, res) => {
  if (req.user.email.toLowerCase() !== req.params.userEmail.toLowerCase()) {
    return res.status(403).json({ message: 'Access forbidden: You can only view your own orders' });
  }
  res.status(200).json(req.userOrders);
});
router.delete('/orders/:orderID', ensureAuthenticated, async (req, res) => {
  try {
    const { orderID } = req.params;
    const deletedOrder = await OrderModel.findByIdAndDelete(orderID);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully', orderID });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
router.get('/orders/id/:orderId', ensureAuthenticated, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
router.put('/orders/:orderId/status', ensureAuthenticated, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, userEmail } = req.body;
    if (!userEmail) {
      return res.status(400).json({ message: 'userEmail is required' }); 
    }
    const validStatuses = ['Pending', 'Completed', 'Cancelled', 'Accepted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } 
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log("User email received:", userEmail);
    const orderDetailsHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Order Status Update</title>
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
        <h1>Order Status Update</h1>
        <p>The status of your order <strong>${updatedOrder._id}</strong> has been updated to <strong>${status}</strong>.</p>
        <p><strong>Order Number:</strong> ${updatedOrder._id}</p>
        <h3>Order Details:</h3>
        <p><strong>Date:</strong> ${new Date(updatedOrder.orderDate).toDateString()}</p>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${updatedOrder.orderItems.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p><strong>Subtotal:</strong> ₹${updatedOrder.totalAmount}</p>
        <p><strong>Payment Method:</strong> ${updatedOrder.paymentMethod}</p>
        <p><strong>Total:</strong> ${updatedOrder.totalAmount}</p>
        <p><strong>Note:</strong> ${updatedOrder.cakeMessage || 'No additional note provided.'}</p>
        <h3>Shipping Address:</h3>
        <p>${updatedOrder.deliveryAddress}</p>
        <p>If you have any questions, feel free to <a href="mailto:ritualcakes2019@gmail.com">contact us</a>.</p>
        <footer>
          <p>Sincerely,<br> Ritual Cakes </p>
          <p>&copy; ${new Date().getFullYear()} Ritual Cakes. All rights reserved.</p>
        </footer>
      </body>
    </html>`;
    const mailOptionsUser = {
      from: 'ritualcakes2019@gmail.com', 
      to: userEmail, 
      subject: `ORDER WAS ${status} FOR ${updatedOrder._id}`, 
      html: orderDetailsHtml, 
    };
    try {
      await transporter.sendMail(mailOptionsUser);
      console.log('Email sent to user successfully');
    } catch (error) {
      console.error('Error sending email to user:', error.message);
    }
    res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;