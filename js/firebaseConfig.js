//firebaseConfig.js
//Purpose: Configuration of the firebase server to the personal financial website.
//Version: addedHeaderComments  Date: 5/14/2021
//Author(s): Mike Nguyen
//Dependencies: Javascript



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

var firebaseConfig = {
    apiKey: "AIzaSyDB6uvlrEFY7A2uAWJ1TfmvbLCwKqPtl5U",
    authDomain: "budgetplan-9f2b7.firebaseapp.com",
    projectId: "budgetplan-9f2b7",
    storageBucket: "budgetplan-9f2b7.appspot.com",
    messagingSenderId: "316647472780",
    appId: "1:316647472780:web:84f0be0eebdd76755385a9",
    measurementId: "G-EG1HXJPMWD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

//config for wishList by Dat Ng
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
