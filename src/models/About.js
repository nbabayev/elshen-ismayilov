const mongoose = require("mongoose");

const AboutSchema = new mongoose.Schema(
  {
    poster: { type: String },
    logo: { type: String },
    education: { type: String },
    activity: { type: String },
    books: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", AboutSchema);
