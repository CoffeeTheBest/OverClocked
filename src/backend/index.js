require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Optional: sanity check
app.get("/", (req, res) => {
  res.send("✨ Backend API is running!");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(" Connected to MongoDB");
    app.listen(process.env.PORT || 5000, () =>
      console.log(` Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error(" MongoDB connection error:", err));
