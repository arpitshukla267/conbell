const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

module.exports = async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ key: "admin" });
    if (!admin || admin.tokenVersion !== payload.v) {
      return res
        .status(401)
        .json({ error: "Your session has expired. Please sign in again." });
    }

    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
