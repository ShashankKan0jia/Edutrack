const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

dotenv.config();
const app = express();
app.disable("x-powered-by");

// VERY IMPORTANT
app.use(cors());
// Apply API cache policy before parsing so error responses receive it too.
// API responses can contain student and attendance data; do not cache them.
app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use(express.json({ limit: "1mb" })); // Limit JSON payload size

app.use("/api", authRoutes);
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Keep malformed JSON and oversized payloads on a predictable JSON API contract.
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON request body" });
  }
  if (err && err.status === 413) {
    return res.status(413).json({ message: "Request body is too large" });
  }
  next(err);
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Keep unexpected API failures on the same JSON response contract.
app.use((err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = Number.isInteger(err?.status) && err.status >= 400 && err.status < 600
    ? err.status
    : 500;

  if (status >= 500) {
    console.error("Unhandled API error:");
    return res.status(status).json({ message: "Internal server error" });
  }

  return res.status(status).json({ message: "Request could not be processed" });
});
