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