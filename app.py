from flask import Flask, render_template, request, jsonify
import pyotp
import qrcode
import base64
from io import BytesIO

app = Flask(__name__)

# Temporary in-memory storage for demo
user_2fa_data = {}


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


# ---------------- GENERATE 2FA ----------------
@app.route("/generate-2fa", methods=["POST"])
def generate_2fa():

    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({
            "success": False,
            "message": "Email is required"
        }), 400

    # Generate secret key
    secret = pyotp.random_base32()

    # Store user secret
    user_2fa_data[email] = {
        "secret": secret,
        "enabled": False
    }

    # Generate provisioning URI
    totp = pyotp.TOTP(secret)
    provisioning_uri = totp.provisioning_uri(
        name=email,
        issuer_name="2FA Authentication Demo"
    )

    # Generate QR code
    qr = qrcode.make(provisioning_uri)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    buffer.seek(0)

    qr_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return jsonify({
        "success": True,
        "qr_code": qr_base64
    })


# ---------------- VERIFY OTP ----------------
@app.route("/verify-2fa", methods=["POST"])
def verify_2fa():

    data = request.get_json()
    email = data.get("email")
    code = data.get("code")

    if not email or not code:
        return jsonify({
            "success": False,
            "message": "Email and code are required"
        }), 400

    if email not in user_2fa_data:
        return jsonify({
            "success": False,
            "message": "2FA setup not found for this email"
        }), 404

    secret = user_2fa_data[email]["secret"]
    totp = pyotp.TOTP(secret)

    if totp.verify(code):
        user_2fa_data[email]["enabled"] = True

        return jsonify({
            "success": True,
            "message": "OTP verified successfully"
        })

    return jsonify({
        "success": False,
        "message": "Invalid OTP code"
    }), 401


# ---------------- CHECK IF USER HAS 2FA ----------------
@app.route("/check-2fa", methods=["POST"])
def check_2fa():

    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({
            "success": False,
            "message": "Email required"
        }), 400

    if email not in user_2fa_data:
        return jsonify({
            "success": True,
            "two_factor_enabled": False
        })

    return jsonify({
        "success": True,
        "two_factor_enabled": user_2fa_data[email]["enabled"]
    })


if __name__ == "__main__":
    app.run(debug=True)