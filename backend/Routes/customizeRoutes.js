const router = require('express').Router();
const Customization = require('../Models/Customizationdb');
const moment = require('moment');
const transporter = require('../Controllers/mailer');
const { BRAND_EMAIL, formatCurrency, formatDate, renderBrandedEmail } = require('../Controllers/emailTemplates');

const multer = require('multer');
const supabase = require('../supabase');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/customizations', upload.single('image'), async (req, res) => {
  try {
    console.log("DEBUG: Received customization request");
    console.log("DEBUG: Body:", req.body);
    
    const { name, email, phone, address, size, cakeType, flavor, message, specialInstructions, deliveryDate } = req.body;
    let imageUrl = req.body.imageOrDesign || "";

    if (req.file) {
      console.log("DEBUG: Processing customization image:", req.file.originalname);
      const file = req.file;
      const fileExt = file.originalname.split('.').pop();
      const fileName = `custom-${Date.now()}.${fileExt}`;
      const filePath = `customizations/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
          .from('ritualcakes')
          .upload(filePath, file.buffer, {
              contentType: file.mimetype,
              upsert: true
          });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
          .from('ritualcakes')
          .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    const twoDaysLater = moment().add(2, 'days').startOf('day').toDate();
    const finalDeliveryDate = deliveryDate ? new Date(deliveryDate) : twoDaysLater;

    if (finalDeliveryDate < twoDaysLater) {
      return res.status(400).json({ message: "Delivery date must be at least two days from now." });
    }
    const customization = new Customization({
      name,
      email,
      phone: phone || "Not Provided",
      address: address || "Not Provided",
      size,
      cakeType,
      flavor,
      message,
      specialInstructions,
      deliveryDate: finalDeliveryDate,
      imageOrDesign: imageUrl,
      approvalStatus: 'pending',
      price: 0
    });
    await customization.save();
    const customizationDetailsHtml = `
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
        <p>Your order <strong>${customization._id}</strong> has been recived on <strong>${new Date(customization.createdAt).toDateString()}</strong> and is being processed.</p>
        <p><strong>Order Number:</strong> ${customization._id}</p>
        <h3>Orderer's Information:</h3>
        <table border="1">
        <tr>
          <th>Field</th>
          <th>Details</th>
        </tr>
        <tr>
          <td>Name</td>
          <td>${customization.name}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>${customization.email}</td>
        </tr>
        <tr>
          <td>Size</td>
          <td>${customization.size}</td>
        </tr>
        <tr>
          <td>Cake Type</td>
          <td>${customization.cakeType}</td>
        </tr>
        <tr>
          <td>Flavor</td>
          <td>${customization.flavor}</td>
        </tr>
        <tr>
          <td>Special Instructions</td>
        <td>${customization.specialInstructions || 'None'}</td>
          </tr>
          <tr>
            <td>Placed on</td>
            <td>${new Date(customization.createdAt).toDateString()}</td>
          </tr>
          <tr>
            <td>Delivery Date</td>
            <td>${new Date(customization.deliveryDate).toDateString()}</td>
          </tr>
        </table>
        <h3>Shipping Address:</h3>
        <p>${customization.address}</p>
        <p>If you have any questions, feel free to <a href="mailto:ritualcakes2019@gmail.com">contact us</a>.</p>
        <footer>
          <p>Sincerely,<br> Ritual Cakes </p>
          <p>&copy; ${new Date().getFullYear()} Ritual Cakes. All rights reserved.</p>
        </footer>
      </body>
    </html>`;
    const brandedCustomizationEmail = renderBrandedEmail({
      preview: `Your custom cake request ${customization._id} has been received.`,
      eyebrow: "Custom order",
      title: "Customization Request Received",
      intro: `Hi ${customization.name}, your custom cake request has been received and is waiting for review.`,
      details: [
        ["Request ID", customization._id],
        ["Name", customization.name],
        ["Email", customization.email],
        ["Phone", customization.phone],
        ["Cake Type", customization.cakeType],
        ["Flavor", customization.flavor],
        ["Size", customization.size],
        ["Delivery Date", formatDate(customization.deliveryDate)],
        ["Message", customization.message || "No message added"],
        ["Special Instructions", customization.specialInstructions || "None"],
        ["Address", customization.address],
      ],
      footerNote: "We will review your request and update you with approval and pricing details soon.",
    });
    const mailOptionsUser = {
      from: BRAND_EMAIL,
      to: customization.email,
      subject: `Customization request received: ${customization._id}`,
      html: brandedCustomizationEmail,
    };
    const mailOptionsAdmin = {
      from: BRAND_EMAIL,
      to: BRAND_EMAIL,
      subject: `New customization request: ${customization._id}`,
      html: brandedCustomizationEmail,
    };
    try {
        await transporter.sendMail(mailOptionsUser);
        await transporter.sendMail(mailOptionsAdmin);
        console.log("DEBUG: Emails sent successfully");
    } catch (mailError) {
        console.error("DEBUG: Failed to send emails, but customization was saved:", mailError.message);
    }
    res.status(201).json({ message: "Customization created successfully", customization });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/customizations', async (req, res) => {
  try {
    const customizations = await Customization.find();
    res.status(200).json(customizations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/customizations/:email', async (req, res) => {
  try {
    const customizations = await Customization.find({ email: req.params.email });

    if (customizations.length === 0) {
      return res.status(404).json({ message: "Customization not found" });
    }
    res.status(200).json(customizations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put('/customizations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalStatus, price } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(approvalStatus)) {
      return res.status(400).json({ message: "Invalid approval status value" });
    }
    const updatedCustomization = await Customization.findByIdAndUpdate(
      id,
      { approvalStatus, price },
      { new: true }
    ).lean();
    if (!updatedCustomization) {
      return res.status(404).json({ message: "Customization not found" });
    }
    const email = updatedCustomization.email;
    if (!email) {
      return res.status(400).json({ message: "Email not found for this customization" });
    }
    console.log("Email fetched from database:", email);
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
        <h1>Customization Status Update</h1>
        <p>The status of your customization <strong>${updatedCustomization._id}</strong> has been updated on <strong>${new Date(updatedCustomization.updatedAt).toDateString()}</strong> to <strong>${approvalStatus}</strong>.</p>
        <p><strong>Customization ID:</strong> ${updatedCustomization._id}</p>
        <h3>Customization Details:</h3>
        <table border="1">
          <tr>
            <th>Field</th>
            <th>Details</th>
          </tr>
          <tr>
            <td>Name</td>
            <td>${updatedCustomization.name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>${updatedCustomization.email}</td>
          </tr>
          <tr>
            <td>Size</td>
            <td>${updatedCustomization.size}</td>
          </tr>
          <tr>
            <td>Cake Type</td>
            <td>${updatedCustomization.cakeType}</td>
          </tr>
          <tr>
            <td>Flavor</td>
            <td>${updatedCustomization.flavor}</td>
          </tr>
          <tr>
            <td>Special Instructions</td>
            <td>${updatedCustomization.specialInstructions || 'None'}</td>
          </tr>
          <tr>
            <td>Placed on</td>
            <td>${new Date(updatedCustomization.createdAt).toDateString()}</td>
          </tr>
          <tr>
            <td>Delivery Date</td>
            <td>${new Date(updatedCustomization.deliveryDate).toDateString()}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>${approvalStatus}</td>
          </tr>
          <tr>
            <td>Price</td>
            <td><strong>₹${updatedCustomization.price}</strong></td>
          </tr>
        </table>
        <h3>Shipping Address:</h3>
        <p>${updatedCustomization.address}</p>
        <p>If you have any questions, feel free to <a href="mailto:ritualcakes2019@gmail.com">contact us</a>.</p>
        <footer>
          <p>Sincerely,<br> Ritual Cakes </p>
          <p>&copy; ${new Date().getFullYear()} Ritual Cakes. All rights reserved.</p>
        </footer>
      </body>
    </html>`;
    const brandedCustomizationStatusEmail = renderBrandedEmail({
      preview: `Your custom cake request ${updatedCustomization._id} is now ${approvalStatus}.`,
      eyebrow: "Custom order update",
      title: "Customization Status Updated",
      intro: `Your custom cake request has been updated to ${approvalStatus}.`,
      details: [
        ["Request ID", updatedCustomization._id],
        ["Status", approvalStatus],
        ["Cake Type", updatedCustomization.cakeType],
        ["Flavor", updatedCustomization.flavor],
        ["Size", updatedCustomization.size],
        ["Delivery Date", formatDate(updatedCustomization.deliveryDate)],
        ["Price", formatCurrency(updatedCustomization.price)],
        ["Special Instructions", updatedCustomization.specialInstructions || "None"],
        ["Address", updatedCustomization.address],
      ],
      footerNote: "If anything needs to be adjusted, reply to this email and we will help.",
    });
    const mailOptionsUser = {
      from: BRAND_EMAIL,
      to: email,
      subject: `Customization ${updatedCustomization._id} is ${approvalStatus}`,
      html: brandedCustomizationStatusEmail,
    };
    try {
      await transporter.sendMail(mailOptionsUser);
      console.log('Email sent to user successfully');
    } catch (error) {
      console.error('Error sending email to user:', error.message);
    }
    res.status(200).json({ 
      message: "Customization status updated successfully", 
      customization: updatedCustomization 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
});

router.delete('/customizations/:id', async (req, res) => {
  try {
    const customization = await Customization.findByIdAndDelete(req.params.id);
    if (!customization) {
      return res.status(404).json({ message: "Customization not found" });
    }
    res.status(200).json({ message: "Customization deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET single customization by ID
router.get('/customizations/single/:id', async (req, res) => {
  try {
    const customization = await Customization.findById(req.params.id);
    if (!customization) {
      return res.status(404).json({ message: "Customization not found" });
    }
    res.status(200).json({ customization });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
