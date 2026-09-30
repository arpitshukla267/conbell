require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const requireAuth = require("./middleware/auth");

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET .env me set nahi hai, auth kaam nahi karega.");
}

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = ["http://localhost:3010", "http://localhost:3005"];
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV === "development" ||
        !process.env.NODE_ENV
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for dev
      }
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---- Admin guard ----
// Public: website ke GET (active data), health, auth,
// job application submit (POST /applications) aur /upload (section check upload.js me hota hai)
app.use("/api", (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  const p = req.path.replace(/\/+$/, "") || "/";

  if (p.startsWith("/auth") || p.startsWith("/health")) return next();
  if (req.method === "POST" && p === "/applications") return next(); // website apply form
  if (req.method === "POST" && p === "/upload") return next(); // upload.js khud check karta hai

  const isRead = req.method === "GET";
  const isAdminRead = p.endsWith("/all") || p.startsWith("/applications"); // applicants ka personal data
  if (isRead && !isAdminRead) return next();

  return requireAuth(req, res, next);
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/hero", require("./routes/hero"));
app.use("/api/products", require("./routes/products"));
app.use("/api/services", require("./routes/services"));
app.use("/api/content/config", require("./routes/config"));
app.use("/api/content", require("./routes/content"));
app.use("/api/faqs", require("./routes/faqs"));
app.use("/api/clients", require("./routes/clients"));
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/health", require("./routes/health"));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
