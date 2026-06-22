// MongoDB connection helper.
// Loads the connection string from .env and exports the Mongoose connection.
const mongoose = require('mongoose');
require("dotenv").config()
 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));
 
module.exports = mongoose.connection;