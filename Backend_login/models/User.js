const db = require("../config/db");

const findUserByEmail = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], callback);
};

const insertUser = (email, otp, expiry, callback) => {
  db.query(
    "INSERT INTO users (email, otp, otp_expiry) VALUES (?, ?, ?)",
    [email, otp, expiry],
    callback
  );
};

const updateUserOTP = (email, otp, expiry, callback) => {
  db.query(
    "UPDATE users SET otp = ?, otp_expiry = ? WHERE email = ?",
    [otp, expiry, email],
    callback
  );
};

module.exports = { findUserByEmail, insertUser, updateUserOTP };
