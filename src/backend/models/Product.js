const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  category: {
    type: String,
    enum: [
      "laptop",
      "keyboard",
      "mouse",
      "monitor",
      "headset",
      "console",
      "accessory",
      "graphics card",
      "controller",
      "cpu",
      "motherboard",
      "ram",
      "cooling system",
      "pc case",
      "psu",
      "storage",
      "streaming gear",
      "gaming chair",
      "vr",
      "networking",
      "capture card",
      "software",
      "bundle",
      "other"
    ]
  },
  brand: String,
  description: String,
  price: Number,
  quantity: Number,
  specs: String // Optional: for technical details
});

module.exports = mongoose.model("Product", productSchema);
