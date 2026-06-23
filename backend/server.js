// Backend server entrypoint for the Pro Tasker API.
// Sets up Express, CORS, static asset serving, route mounting, and global error handling.
const express = require('express');
const path = require('path');
const db = require('./connection/db');
const cors = require("cors")
const search = require("./routes/search")
const user = require("./routes/user")
const bookmark = require("./routes/bookmarks")
require('dotenv').config();
 
const app = express();
const PORT = process.env.PORT || 3001;
 

// Parse incoming form-encoded and JSON request bodies.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
 
// Whitelist trusted frontend hosts for browser-based CORS requests.
const allowedOrigins = [
  "http://localhost:5173",
  "https://itunes-gallery.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("BLOCKED CORS:", origin); // 🔥 Useful debug log for blocked origins
    return callback(null, false); // ❗ Do not allow unknown origins
  },
  credentials: true
}));

app.use("/api/search", search);
app.use("/api/user", user)
app.use("/api/bookmark", bookmark)
// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Global error handler catches any errors that bubble up from route handlers.
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);

  res.status(500).json({
    message: err.message,
  });
});



// Log every incoming request for easier debugging of API traffic.
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});