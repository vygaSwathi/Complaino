require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const connectDatabase = require("./db/database");

const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");
const issueRoutes = require("./routes/issue.routes");
const chatRoutes = require("./routes/chat.routes");

const { requireAuth } = require("./middleware/auth.middleware");
const { requireRole } = require("./middleware/role.middleware");

const app = express();

/* ========================================
   SECURITY HEADERS
======================================== */

app.use(helmet());

/* ========================================
   CORS
======================================== */

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",
    credentials: true,
  })
);

/* ========================================
   PARSE JSON REQUEST BODIES
======================================== */

app.use(
  express.json({
    limit: "10kb",
  })
);

/* ========================================
   PARSE COOKIES
======================================== */

app.use(cookieParser());

/* ========================================
   AUTHENTICATION ROUTES
======================================== */

app.use("/api/auth", authRoutes);

/* ========================================
   ISSUE ROUTES
======================================== */

app.use("/api/issues", issueRoutes);

/* ========================================
   ADMIN ROUTES
======================================== */

app.use("/api/admin", adminRoutes);

/* ========================================
   CHAT ROUTES
======================================== */

app.use("/api/chat", chatRoutes);

/* ========================================
   HEALTH CHECK
======================================== */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Campus Connect backend is running",
  });
});

/* ========================================
   PROTECTED TEST ROUTE
======================================== */

app.get(
  "/api/protected-test",
  requireAuth,
  (req, res) => {
    res.json({
      success: true,
      message: "You are authenticated",
      user: req.user,
    });
  }
);

/* ========================================
   ADMIN-ONLY TEST ROUTE
======================================== */

app.get(
  "/api/admin-test",
  requireAuth,
  requireRole("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "You have admin access",
      user: req.user,
    });
  }
);

/* ========================================
   CONNECT TO MONGODB
======================================== */

connectDatabase();

/* ========================================
   START SERVER
======================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Campus Connect API running on port ${PORT}`
  );
});