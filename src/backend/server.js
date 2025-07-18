const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // 👈 frontend origin
    credentials: true,               // 👈 allow cookies!
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// DB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("🌱 MongoDB connected!"))
  .catch((err) => console.error("DB error: ", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
