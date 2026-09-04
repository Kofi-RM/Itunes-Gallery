// User-related routes: registration, login, and GitHub OAuth.
const router = require('express').Router();
const  User  = require('../models/User');
const { signToken } = require('../util/auth');
const passport = require("../util/passport")

const upload = require("../util/upload")
const {authMiddleware} = require("../util/auth")
require('dotenv').config();

// GET /api/users - return all users (mainly for development / debugging).
router.get("/", async (req,res) => {
  try {
    const users = await User.find()
    res.json(users);
  } catch (err) {
 res.status(400).json({
  error: err.message
})
  }
})

// current user details
router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

// get user by id
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// upload image
router.post(
  "/me/avatar", authMiddleware,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Please select an image." });
    const imageUrl = req.file.path; // Cloudinary URL

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImageUrl: imageUrl },
      { new: true }
    ).select("_id username email profileImageUrl");

    res.json(user);
  }
);


// POST /api/users/register - create a new account and return a JWT
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  // check if valid email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    typeof email !== "string" || !emailRegex.test(email)
  ) {
  return res.status(400).json({
    message: "Please use a valid email address"
  });
}

  try {
    // Local registration must never accept provider identities from the client.
    if (typeof username !== "string" || username.trim().length < 4 ||
        typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ message: "Use a username of at least 4 characters and a password of at least 8 characters." });
    }
    const user = await User.create({ email, username: username.trim(), password });
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
   console.error("POST ERROR:", err);

  res.status(500).json({
    message: "Internal Server Error",
    error: err.message || "Unknown error"
  });
  }
});
 
// POST /api/users/login - Authenticate a user and return a JWT token
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
 
  if (!user) {
    return res.status(400).json({ message: "Can't find this user" });
  }
 
  const correctPw = await user.isCorrectPassword(req.body.password);
 
  if (!correctPw) {
    return res.status(400).json({ message: 'Wrong password!' });
  }
 
  const token = signToken(user);
  res.json({ token, user });
});
 
// Route to start the GitHub OAuth flow.
// Visiting this endpoint redirects the browser to GitHub's login page.
router.get(
  '/auth/github',
  passport.authenticate('github', { scope: ['user:email'], authorizationParams: {
      prompt: 'login',     // Appended directly to GitHub OAuth URL
    } }) // Request email scope
);
 
// GitHub OAuth callback route.  
// If authentication succeeds, issue a local JWT and redirect to the frontend.
router.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${process.env.FRONTEND_DEPLOYMENT}/login`,
    session: false,
     // We are using tokens, not sessions
  }),
  (req, res) => {
    // At this point, `req.user` is the user profile returned from the verify callback.
    // We can now issue our own JWT to the user.
    const token = signToken(req.user);
    // Redirect the user to the frontend with the token, or send it in the response
     res.redirect(
      `${process.env.FRONTEND_DEPLOYMENT}/oauth-success#token=${encodeURIComponent(token)}`
    );
  }
);

module.exports = router;
