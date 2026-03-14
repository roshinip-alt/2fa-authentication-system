Two-Factor Authentication System (2FA) 
A web application that uses Firebase Authentication, Flask, and Time-based One-Time Passwords (TOTP) to implement Two-Factor Authentication (2FA).
Users use their email address and password to authenticate, and accounts that have 2FA enabled need an OTP created by Google Authenticator in order to log in.

Features: 
Firebase Authentication for email and password authentication
QR code-based 2FA enrollment 
Google Authenticator for TOTP verification 
Flask and PyOTP for backend validation
Enforcing OTP verification through a secure login process 
Simple dashboard after successful authentication
Logout functionality 
Clean and responsive UI 

Tech Stack:
Frontend:
HTML 
 JavaScript
 Firebase Authentication

Backend: 
Flask 
 PyOTP (TOTP generation & verification) 
 QRCode (QR code generation)

