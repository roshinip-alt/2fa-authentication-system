// Firebase imports
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Get UI elements
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const enable2FABtn = document.getElementById("enable-2fa-btn");
const verifyOTPBtn = document.getElementById("verify-otp-btn");

const statusText = document.getElementById("status");
const qrSection = document.getElementById("qr-section");
const qrImage = document.getElementById("qr-image");
const otpSection = document.getElementById("otp-section");
const otpInput = document.getElementById("otp-code");

// Function to update status text
function updateStatus(message) {
  statusText.innerText = message;
  console.log(message);
}

// Hide sections initially
qrSection.style.display = "none";
otpSection.style.display = "none";

// ---------------- SIGN UP ----------------
signupBtn.addEventListener("click", async () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    updateStatus("Signup successful: " + user.user.email);
  } catch (error) {
    updateStatus("Signup error: " + error.message);
    console.log(error);
  }
});

// ---------------- LOGIN ----------------
loginBtn.addEventListener("click", async () => {

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {

    const user = await signInWithEmailAndPassword(auth, email, password);

    const response = await fetch("/check-2fa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email })
    });

    const data = await response.json();

    if (data.success && data.two_factor_enabled) {

      otpSection.style.display = "block";
      qrSection.style.display = "none";
      updateStatus("Password verified. Enter OTP to complete login.");

    } else {

      otpSection.style.display = "none";
      qrSection.style.display = "none";
      updateStatus("Login successful: " + user.user.email);

      window.location.href = "/dashboard";

    }

  } catch (error) {

    updateStatus("Login error: " + error.message);
    console.log(error);

  }

});

// ---------------- ENABLE 2FA ----------------
enable2FABtn.addEventListener("click", async () => {
  const email = document.getElementById("login-email").value;

  if (!email) {
    updateStatus("Enter your email in the login section first.");
    return;
  }

  try {
    const response = await fetch("/generate-2fa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email
      })
    });

    const data = await response.json();

    if (data.success) {
      qrSection.style.display = "block";
      otpSection.style.display = "block";
      qrImage.src = "data:image/png;base64," + data.qr_code;

      updateStatus("QR generated. Scan with Google Authenticator and enter the OTP.");
    } else {
      updateStatus(data.message);
    }
  } catch (error) {
    updateStatus("Error generating 2FA setup.");
    console.log(error);
  }
});

// ---------------- VERIFY OTP ----------------
// ---------------- VERIFY OTP ----------------
verifyOTPBtn.addEventListener("click", async () => {

  const email = document.getElementById("login-email").value;
  const code = otpInput.value;

  if (!email || !code) {
    updateStatus("Enter both email and OTP code.");
    return;
  }

  try {

    const response = await fetch("/verify-2fa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        code: code
      })
    });

    const data = await response.json();

    if (data.success) {

      updateStatus("OTP verified successfully.");

      qrSection.style.display = "none";
      otpSection.style.display = "none";

      otpInput.value = "";

      window.location.href = "/dashboard";

    } else {

      updateStatus(data.message);

    }

  } catch (error) {

    updateStatus("Error verifying OTP.");
    console.log(error);

  }

});