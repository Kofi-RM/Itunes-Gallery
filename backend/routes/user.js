// User-related routes: registration, login, account details, and OAuth.
const router = require("express").Router();
const User = require("../models/User");
const { signToken, authMiddleware } = require("../util/auth");
const passport = require("../util/passport");
const upload = require("../util/upload");
require("dotenv").config();

const frontendBase = (process.env.FRONTEND_URL || process.env.FRONTEND_DEPLOYMENT ||
  (process.env.NODE_ENV === "production" ? "https://itunes-gallery.onrender.com" : "http://localhost:5173"))
  .replace(/\/$/, "");

const frontendPath = (path) => `${frontendBase}${path}`;
const callbackUrl = (req, provider) => {
  const configuredBase = process.env.OAUTH_BACKEND_URL?.replace(/\/$/, "");
  const requestBase = `${req.protocol}://${req.get("host")}`;
  return `${configuredBase || requestBase}/api/users/auth/${provider}/callback`;
};
const providerAvailable = (provider) => (req, res, next) => {
  if (passport.oauthProviders[provider]) return next();
  res.redirect(frontendPath(`/login?oauthError=${provider}_not_configured`));
};
const finishOAuth = (provider) => (req, res) => {
  const token = signToken(req.user);
  res.redirect(frontendPath(`/oauth-success#token=${encodeURIComponent(token)}&provider=${provider}`));
};
const authenticate = (provider, options = {}) => (req, res, next) =>
  passport.authenticate(provider, {
    session: false,
    callbackURL: callbackUrl(req, provider),
    ...options,
  })(req, res, next);

router.get("/me", authMiddleware, (req, res) => res.json(req.user));

router.post("/me/avatar", authMiddleware, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Please select an image." });
  const user = await User.findByIdAndUpdate(req.user._id,
    { profileImageUrl: req.file.path }, { new: true })
    .select("_id username email profileImageUrl");
  res.json(user);
});

router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== "string" || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Please use a valid email address" });
  }
  try {
    if (typeof username !== "string" || username.trim().length < 4 ||
        typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ message: "Use a username of at least 4 characters and a password of at least 8 characters." });
    }
    const user = await User.create({ email: email.toLowerCase(), username: username.trim(), password });
    res.status(201).json({ token: signToken(user), user });
  } catch (error) {
    const duplicate = error?.code === 11000;
    res.status(duplicate ? 409 : 500).json({
      message: duplicate ? "An account with this email already exists." : "Internal Server Error",
    });
  }
});

router.post("/login", async (req, res) => {
  const email = typeof req.body.email === "string" ? req.body.email.toLowerCase() : "";
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Can't find this user" });
  if (!await user.isCorrectPassword(req.body.password)) {
    return res.status(400).json({ message: "Wrong password!" });
  }
  res.json({ token: signToken(user), user });
});

router.get("/auth/github", providerAvailable("github"),
  authenticate("github", { scope: ["user:email"], prompt: "login" }));
router.get("/auth/github/callback", providerAvailable("github"),
  authenticate("github", { failureRedirect: frontendPath("/login?oauthError=github") }),
  finishOAuth("github"));

router.get("/auth/google", providerAvailable("google"),
  authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));
router.get("/auth/google/callback", providerAvailable("google"),
  authenticate("google", { failureRedirect: frontendPath("/login?oauthError=google") }),
  finishOAuth("google"));

module.exports = router;
