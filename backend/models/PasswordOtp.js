const mongoose = require("mongoose");

const passwordOtpSchema = new mongoose.Schema({
  otpHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// expiresAt guzarte hi MongoDB khud document delete kar dega
passwordOtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PasswordOtp", passwordOtpSchema);
