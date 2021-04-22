// firebase authentication
var firebaseConfig = {
  apiKey: "AIzaSyBlRMBbNN9rqcr8MjKqq0LvRKsF73wG6EA",
  authDomain: "time-to-move-d8f7b.firebaseapp.com",
  projectId: "time-to-move-d8f7b",
  storageBucket: "time-to-move-d8f7b.appspot.com",
  messagingSenderId: "480679560867",
  appId: "1:480679560867:web:92f5576184173266e06116",
};

firebase.initializeApp(firebaseConfig);

var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start("#firebaseui-auth-container", {
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  // Other config options...
});

var x = document.getElementById("login");
var y = document.getElementById("register");
var z = document.getElementById("btn");

function register() {
  x.style.left = "-400px";
  y.style.left = "50px";
  z.style.left = "110px";
}

function login() {
  x.style.left = "50px";
  y.style.left = "450px";
  z.style.left = "0px";
}

document.getElementById("login-button").addEventListener("click", login);

document.getElementById("register-button").addEventListener("click", register);
