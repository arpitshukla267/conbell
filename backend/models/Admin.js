const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    key: { type: String, default: "admin", unique: true },
    passwordHash: { type: String, required: true },
    // password change hote hi badhega, taaki purane tokens invalid ho jaayein
    tokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Admin", adminSchema);
