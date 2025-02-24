const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Ensure you have set your service account credentials in your environment
    databaseURL: 'https://your-project-id.firebaseio.com', // Update with your project ID
});

// Create a Firestore instance
const db = admin.firestore();

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Protected route (only accessible with a valid token)
app.get('/api/private', auth, (req, res) => {
    res.send('This is a protected route');
});

// Serve React app's Login html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));// Update the path occurring to your build folder
});

// Route for posting a message
app.post('/message', async (req, res) => {
    const newMessage = {
        text: req.body.text,
    };

    try {
        const messageRef = await db.collection('messages').add(newMessage);
        res.status(201).json({ id: messageRef.id, ...newMessage });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Error saving message' });
    }
});

// Route for fetching all messages from Firestore
app.get('/messages', async (req, res) => {
    try {
        const messagesRef = db.collection('messages');
        const snapshot = await messagesRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'No messages found' });
        }

        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

// Route for fetching a single message by ID
app.get('/messages/:id', async (req, res) => {
    const messageId = req.params.id;
    try {
        const messageRef = db.collection('messages').doc(messageId);
        const doc = await messageRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ message: 'Error fetching message' });
    }
});

// Add required module
const path = require('path');

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;