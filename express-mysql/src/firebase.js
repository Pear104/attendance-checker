// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2tn3jIGm5ephjtMLjTs1ePNS5lCw8cm8",
  authDomain: "test-firebase-dca9f.firebaseapp.com",
  projectId: "test-firebase-dca9f",
  databaseURL: "https://test-firebase-dca9f-default-rtdb.firebaseio.com",
  storageBucket: "test-firebase-dca9f.appspot.com",
  messagingSenderId: "229724685050",
  appId: "1:229724685050:web:b1477fe57c041a9d323f43",
  measurementId: "G-8SC737FXR0",
};
// Initialize Firebase

const application = initializeApp(firebaseConfig);
// Export firestore database
// It will be imported into your react app whenever it is needed
const db = getFirestore(application);
module.exports = {
  db,
};
