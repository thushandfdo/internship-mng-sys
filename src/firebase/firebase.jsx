import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtXYv85-t0hG7UjjmXjyVheduynAPoI5M",
  authDomain: "internship-management-sys.firebaseapp.com",
  projectId: "internship-management-sys",
  storageBucket: "internship-management-sys.appspot.com",
  messagingSenderId: "1025178721792",
  appId: "1:1025178721792:web:ac2acb806d5363589fc2e5",
  measurementId: "G-XCH3HVJB10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
