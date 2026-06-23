// JWT helper functions for the backend.  
// - authMiddleware validates the token and attaches req.user.
// - signToken creates a new JWT for a logged-in user.
const jwt = require('jsonwebtoken');
 require("dotenv").config()
const secret = process.env.JWT_SECRET;
const expiration = '2h';
const User = require("../models/User")
 
module.exports = {
  authMiddleware: async function (req, res, next) {
    let token =
  req.body?.token ||
  req.query?.token ||
  req.headers?.authorization
 
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
 
    if (!token) {
      return res.status(401).json({ message: 'You must be logged in to do that.' });
    }
 
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      const user = await User.findById(data._id).select(
  "_id username profileImageUrl"
); // get profileImageUrl - data - from signed token doesnt have it

req.user = user;
    } catch (err) {
      console.log('Invalid token');
      return res.status(401).json({
   
    error: err.message
  });
    }
 
    next();
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
 
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};