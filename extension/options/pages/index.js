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

const firestore = firebase.firestore();

const getDummy = async () => {
  const response = await firestore.collection("dummy").get();
  console.log(response);
};

getDummy();
