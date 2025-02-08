require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// Nodemailer Transporter (for sending OTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate Random OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Route: Send OTP (Login/Register)
app.post("/send-otp", (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60000); // OTP expires in 5 mins

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.length === 0) {
        // New User → Insert OTP
        db.query(
          "INSERT INTO users (email, otp, otp_expiry) VALUES (?, ?, ?)",
          [email, otp, otpExpiry],
          (err) => {
            if (err) return res.status(500).json({ error: err });
          }
        );
      } else {
        // Existing User → Update OTP
        db.query(
          "UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?",
          [otp, otpExpiry, email]
        );
      }

      // Send OTP via Email
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is: ${otp}`,
      });

      res.json({ message: "OTP sent!" });
    }
  );
});

// ✅ Route: Verify OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND otp = ? AND otp_expiry > NOW()",
    [email, otp],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.length === 0) {
        return res.status(400).json({ message: "Invalid OTP or expired!" });
      }

      res.json({ message: "OTP Verified! Login successful." });
    }
  );
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
