// server.js
const express = require('express');
const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
const multer = require('multer');
const path = require('path');

// Set your SendGrid API Key
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');  // Replace with your actual SendGrid API Key

const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Storage setup for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Upload settings
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDFs are allowed!'), false);
        }
    }
});

// Function to send reset password email
async function sendResetPasswordEmail(userEmail) {
  const msg = {
    to: userEmail,  // The email the user entered
    from: 'jesse.viljoen@capaciti.org.za',  // The sender email
    subject: 'Password Reset Request',
    text: `Hi, \n\nPlease click on the following link to reset your password: \n[RESET_LINK_HERE]`,
    html: `<strong>Hi,</strong><br><br>Please click on the following link to reset your password: <br><a href="[RESET_LINK_HERE]">Reset Password</a>`
  };

  try {
    await sgMail.send(msg);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Route to handle sending the reset password email
app.post('/send-reset-link', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        await sendResetPasswordEmail(email);
        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send password reset email' });
    }
});

// Route to upload PDFs
app.post('/upload', upload.single('pdfFile'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    res.send(`PDF uploaded: ${req.file.filename}`);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
