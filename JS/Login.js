// --- Firebase Configuration (Client-Side) ---
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "system-galacticgeeks.firebaseapp.com",
    databaseURL: "https://system-galacticgeeks-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "system-galacticgeeks",
    storageBucket: "system-galacticgeeks.appspot.com",
    messagingSenderId: "835850762785",
    appId: "1:835850762785:web:d2e42efe2422dac089c160",
    measurementId: "G-5S4L5M5GG5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Login Component (React) ---
import React, { useState } from 'react';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            let userCredential;
            if (isRegistering) {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    name: email.split('@')[0],
                    email: email,
                });
                setMessage('Registration Successful');
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                setMessage('Login Successful');
            }
            onLogin(userCredential.user);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setIsLoading(false);
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
                    required
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                />
                <button type='submit' disabled={isLoading}>
                    {isLoading ? (isRegistering ? 'Registering...' : 'Logging in...') : (isRegistering ? 'Register' : 'Login')}
                </button>
            </form>
            <p>{message}</p>
            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? 'Login Instead' : 'Register Instead'}
            </button>
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