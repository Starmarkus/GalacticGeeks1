// JavaScript source code
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Use your service account

    databaseURL: 'https://your-project-id.firebaseio.com'// Change to your database URL
});

// Create a Firestore instance
const db = admin.firestore();

class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Hash password before saving to Firestore
    async save() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        const userRef = db.collection('users').doc(this.email);
        await userRef.set({
            name: this.name,
            email: this.email,
            password: this.password,
        });
    }
}

// Change into User class
(async () => {
    const newUser = new User('John Doe', 'john.doe@example.com', 'password123');
    await newUser.save();
    console.log('User saved to Firestore');
})();