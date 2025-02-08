const db = require("../config/db");
const transporter = require("../config/mailer");
const { findUserByEmail, insertUser, updateUserOTP } = require("../models/User");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOTP = (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60000); // 5 min expiry

  findUserByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.length === 0) {
      insertUser(email, otp, otpExpiry, (err) => {
        if (err) return res.status(500).json({ error: err });
      });
    } else {
      updateUserOTP(email, otp, otpExpiry, (err) => {
        if (err) return res.status(500).json({ error: err });
      });
    }

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    res.json({ message: "OTP sent!" });
  });
};

exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND otp = ? AND otp_expiry > NOW()",
    [email, otp],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.length === 0) return res.status(400).json({ message: "Invalid OTP or expired!" });

      res.json({ message: "OTP Verified! Login successful." });
    }
  );
};
