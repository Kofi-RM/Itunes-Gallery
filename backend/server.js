// Backend server entrypoint for the Pro Tasker API.
// Sets up Express, CORS, static asset serving, route mounting, and global error handling.
const express = require('express');
const path = require('path');
const db = require('./connection/db');
const cors = require("cors")

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
// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}