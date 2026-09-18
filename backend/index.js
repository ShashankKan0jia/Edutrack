const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

// VERY IMPORTANT
app.use(cors());
app.use(express.json({ limit: "1mb" })); // Limit JSON payload size

app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
