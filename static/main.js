import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC4AZoEZO9Z4lPbtOwjleny7TXovVSHPC8",
  authDomain: "fa-authentication-709ae.firebaseapp.com",
  projectId: "fa-authentication-709ae",
  appId: "1:25453409409:web:633697aea1614d1d110980"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signupButton = document.querySelectorAll("button")[0];
const loginButton = document.querySelectorAll("button")[1];

signupButton.addEventListener("click", async () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    alert("Signup successful: " + userCredential.user.email);
  } catch (error) {
    alert("Signup error: " + error.message);
    console.log(error);
  }
});

loginButton.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful: " + userCredential.user.email);
    window.location.href = "/dashboard";
  } catch (error) {
    alert("Login error: " + error.message);
    console.log(error);
  }
});