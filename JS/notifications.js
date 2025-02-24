// --- Firebase Configuration (Client-Side) ---
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"; // Import auth functions
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import {  getMessaging, getToken, onMessage } from "firebase/messaging"; // Import Firebase Cloud Messaging functions

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXGnKdWdVmi2Z98DCZSYKV_nHx9zH7xRg", // Replace with your API key
    authDomain: "system-galacticgeeks.firebaseapp.com",
    databaseURL: "https://system-galacticgeeks-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "system-galacticgeeks",
    storageBucket: "system-galacticgeeks.appspot.com", // Corrected storageBucket format
    messagingSenderId: "835850762785",
    appId: "1:835850762785:web:d2e42efe2422dac089c160",
    measurementId: "G-5S4L5M5GG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);  // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore
const messaging = getMessaging(app); // Initialize Firebase Cloud Messaging


// --- Login Component (React) ---
import React, { useState, useEffect } from 'react';

function Login({ onLogin }) { // Accept onLogin as a prop
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false); // New: Add registering state

    // Add these states and useEffect for notification permission handling
    const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState(''); // For the notification popup message

     useEffect(() => {
         // Check for notification permission on component mount
        const checkPermission = async () => {
            if ('Notification' in window) {
                 const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    setNotificationPermissionGranted(true);
                   //  getAndRegisterForNotifications(); // Call if you want immediate token retrieval.
                 }
            }

        };
         checkPermission();
    }, []);

    // Function to show the notification popup (moved here for easier use)
    const showNotificationPopup = (message) => {
        setNotificationMessage(message);
        const popup = document.getElementById('notification-popup');
        if (popup) {
            const popupContent = popup.querySelector('.popup-content p');
            if (popupContent) {
                popupContent.textContent = message;
            }
            popup.style.display = 'block'; // Show the popup
        }
    };

     // Function to hide the notification popup
    const hideNotificationPopup = () => {
        const popup = document.getElementById('notification-popup');
        if (popup) {
           popup.style.display = 'none'; // Hide the popup
        }
    };

      // Event listener for the close button (to close the popup)
    useEffect(() => {
        const closeBtn = document.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', hideNotificationPopup);
        }
        // Cleanup the event listener when the component unmounts
        return () => {
            if (closeBtn) {
                closeBtn.removeEventListener('click', hideNotificationPopup);
            }
        };
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

        if (isRegistering) {
            await handleRegister();
        } else {
            await handleLogin();
        }
    };

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // If login is successful, you'll get userCredential.user

            setMessage('Login Successful');
            onLogin(userCredential.user); // Pass the user object to onLogin

            // Call getToken function after successful login (or registration)
            if(notificationPermissionGranted) {
                await getAndRegisterForNotifications(userCredential.user.uid); // Pass user ID
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage(error.message); // Firebase Authentication errors are more descriptive
        } finally {
            setIsLoading(false);
        }
    };

     const handleRegister = async () => {
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            if (userCredential.user) {
                await setDoc(doc(db, "users", userCredential.user.uid), { // Use user's UID as doc ID
                    name: email.split('@')[0], // Example: Use part of the email as a default name or ask for a name separately
                    email: email,
                    // password: userCredential.user.password  // DO NOT STORE PASSWORD
                });

                if(notificationPermissionGranted) {
                    await getAndRegisterForNotifications(userCredential.user.uid); // Pass user ID
                }
            }
            setMessage('Registration Successful');
            onLogin(userCredential.user); // Pass user data to onLogin
        } catch (error) {
            console.error('Registration error:', error);
            setMessage(error.message); // Firebase Authentication errors
        } finally {
            setIsLoading(false);
        }
    };

    // This function now accepts the user's UID
    const getAndRegisterForNotifications = async (userId) => {
        try {
            const currentToken = await getToken(messaging, { vapidKey: 'BBq9i2W67K5W1v195fL2n1XbK6C61kK56l1m8I946M0X8L6p3jX7m4q8L5p2n1k3' }); // Replace with your VAPID key
            if (currentToken) {
                // Send the token to your server so you can send notifications from there
                console.log("FCM Token:", currentToken);

                // Store the token in Firestore (or your backend database)
                await setDoc(doc(db, "users", userId, "fcmTokens", currentToken), {
                    token: currentToken,
                    createdAt: new Date(), // Optional: Add a timestamp
                });


            } else {
                // Show permission request UI (user must grant permission)
                console.log('No registration token available. Request permission to generate one.');
            }
        } catch (error) {
            console.error('An error occurred while retrieving token:', error);
        }
    };


    return (
        <div>
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
                <button type='submit' disabled={isLoading}>
                    {isLoading ? (isRegistering ? 'Registering...' : 'Logging in...') : (isRegistering ? 'Register' : 'Login')}
                </button>
            </form>
            <p>{message}</p>
            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Login Instead' : 'Register Instead'}
            </button>
             {/* Notification Popup HTML (moved here for simplicity) */}
            <div id="notification-popup" className="popup" style={{ display: 'none' }}> {/* Initially hidden */}
                <div className="popup-header">
                    <h2>Notification</h2>
                    <span className="close-btn">×</span>
                </div>
                <div className="popup-content">
                    <p>{notificationMessage}</p> {/* Display the notification message */}
                </div>
            </div>
        </div>
    );
}

export default Login;

// --- Backend (Node.js/Express -  This part is for your backend (unmodified in this example) ---
// This code is for the backend server (Node.js) and is NOT client-side javascript

// Backend (Node.js with Express) - Login route (no changes needed, but included for context)
// This code is for the backend server (Node.js) and is NOT client-side javascript
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const userRef = db.collection('users').doc(email);
//         const userSnap = await userRef.get();
//         if (!userSnap.exists) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         const user = userSnap.data();
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

//         const token = jwt.sign({ userId: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token });
//     } catch (error) {
//         res.status(500).json({ error: 'Server error' });
//     }
// });

//  --- Old Code (Removed - Not Needed with Firebase Authentication)---
// const admin = require('firebase-admin');
// const bcrypt = require('bcryptjs');
// // Initialize Firebase Admin SDK
// admin.initializeApp({
//     credential: admin.credential.applicationDefault(), // Use your service account

//     databaseURL: 'https://your-project-id.firebaseio.com'// Change to your database URL
// });
// const db = admin.firestore();
// class User {
//     constructor(name, email, password) {
//         this.name = name;
//         this.email = email;
//         this.password = password;
//     }
//     async save() {
//         if (this.password) {
//             this.password = await bcrypt.hash(this.password, 10);
//         }
//         const userRef = db.collection('users').doc(this.email);
//         await userRef.set({
//             name: this.name,
//             email: this.email,
//             password: this.password,
//         });
//     }
// }
// (async () => {
//     const newUser = new User('John Doe', 'john.doe@example.com', 'password123');
//     await newUser.save();
//     console.log('User saved to Firestore');
// })();