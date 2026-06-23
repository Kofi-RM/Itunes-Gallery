// Passport configuration for GitHub OAuth.
// This file registers the GitHub strategy and serializes users for session handling.
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
 
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL, // e.g., 'http://localhost:3001/api/users/auth/github/callback'
    },
    // This is the "verify" callback executed after GitHub returns a user profile.
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Look for an existing user with the GitHub account id.
        const existingUser = await User.findOne({ githubId: profile.id });
 
        if (existingUser) {
          return done(null, existingUser);
        }
 
        // Create a new user record for first-time GitHub logins.
        const newUser = new User({
          githubId: profile.id,
          username: profile.username,
          email: profile.emails?.[0]?.value, // Some providers return an array of emails
        });
 
        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err);
      }
    }
  )
);
 
// These functions are only required if using sessions with passport.
passport.serializeUser((user, done) => {
  done(null, user.id);
});
 
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

module.exports = passport