importScripts("https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.19.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyA-eGQMsoiNn30kqeVClYCYTkWr0SpAlb0",
  authDomain: "sasfingts.firebaseapp.com",
  databaseURL: "https://sasfingts.firebaseio.com",
  projectId: "sasfingts",
  storageBucket: "sasfingts.appspot.com",
  messagingSenderId: "919526667324",
  appId: "1:919526667324:web:a6cd295797c17aeba7bf39",
  measurementId: "G-S1QRVH7XLV"
});

const messaging = firebase.messaging();
