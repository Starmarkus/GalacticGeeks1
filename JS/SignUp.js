// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXGnKdWdVmi2Z98DCZSYKV_nHx9zH7xRg",
    authDomain: "system-galacticgeeks.firebaseapp.com",
    databaseURL: "https://system-galacticgeeks-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "system-galacticgeeks",
    storageBucket: "system-galacticgeeks.appspot.com",
    messagingSenderId: "835850762785",
    appId: "1:835850762785:web:d2e42efe2422dac089c160",
    measurementId: "G-5S4L5M5GG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Sign-up function
async function signUpUser(name, email, password) {
    try {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Store additional user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            uid: user.uid
        });
        console.log("User registered successfully:", user);
    } catch (error) {
        console.error("Sign-up error:", error.message);
    }
}

// Login function
async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential.user);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Server error during login' }); // More descriptive error
    }
};


app.use('/api/auth', router); // Mount the router at the '/api/auth' path


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});



//  CLIENT-SIDE CODE (React/JavaScript in the browser) - Moved User Class logic out

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

// // Change into User class  (Removed: This is not needed and moved to server-side)
// (async () => {
//     const newUser = new User('John Doe', 'john.doe@example.com', 'password123');
//     await newUser.save();
//     console.log('User saved to Firestore');
// })();
