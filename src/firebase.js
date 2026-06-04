import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAxBQscEb7q_ih2sFennvpvRFJi6V6Y6ps",
  authDomain: "bosco-blackjack.firebaseapp.com",
  projectId: "bosco-blackjack",
  storageBucket: "bosco-blackjack.firebasestorage.app",
  messagingSenderId: "1056877672847",
  appId: "1:1056877672847:web:9e83f324dbf9b419eb73fa",
  measurementId: "G-X16P2L032Z",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const analytics = getAnalytics(app);