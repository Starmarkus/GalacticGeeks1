# GalacticGeeks
Captain's log 000



**** Firebase Database API key *****
-------------------------------------------------------------------------------------------------------------------
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyCXGnKdWdVmi2Z98DCZSYKV_nHx9zH7xRg",
  
  authDomain: "system-galacticgeeks.firebaseapp.com",
  
  databaseURL: "https://system-galacticgeeks-default-rtdb.europe-west1.firebasedatabase.app",
  
  projectId: "system-galacticgeeks",
  
  storageBucket: "system-galacticgeeks.firebasestorage.app",
  
  messagingSenderId: "835850762785",
  
  appId: "1:835850762785:web:d2e42efe2422dac089c160",
  
  measurementId: "G-5S4L5M5GG5"
  
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
