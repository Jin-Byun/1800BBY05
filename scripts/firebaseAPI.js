// Your web app's Firebase configuration
let firebaseConfig = {
  apiKey: "AIzaSyB4BIwUmrFoAhe8rPZZnSqTBsRjdsh-7vM",
    authDomain: "proj-bby05.firebaseapp.com",
    projectId: "proj-bby05",
    storageBucket: "proj-bby05.appspot.com",
    messagingSenderId: "226932291387",
    appId: "1:226932291387:web:a8e53220c4229c4605e91e"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
var storage = firebase.storage();