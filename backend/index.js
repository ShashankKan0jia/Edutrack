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
app.use(express.json({ limit: "1mb" })); // Limit JSON payload size

// Keep malformed JSON requests on the API contract instead of returning HTML.
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON request body" });
  }
  next(err);
});

// API responses can contain student and attendance data; do not cache them.
app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use("/api", authRoutes);
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "API route not found" });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
