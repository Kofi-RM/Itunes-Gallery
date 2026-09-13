require("dotenv").config();
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

const providers = {
  github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
  google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
};

function usableUsername(username, provider, id) {
  const value = typeof username === "string" ? username.trim() : "";
  return value.length >= 4 ? value : `${provider}-${value || id}`;
}

async function findOrCreateOAuthUser({ provider, id, username, emailInfo, profileImageUrl }) {
  const idField = `${provider}Id`;
  let user = await User.findOne({ [idField]: id });
  if (user) return user;

  const email = emailInfo?.value?.toLowerCase();
  // Only join an OAuth identity to an existing account when the provider
  // explicitly reports that it verified the address.
  if (email && emailInfo.verified === true) {
    user = await User.findOne({ email });
    if (user) {
      user[idField] = id;
      if (!user.profileImageUrl && profileImageUrl) user.profileImageUrl = profileImageUrl;
      await user.save();
      return user;
    }
  }

  user = new User({
    [idField]: id,
    username: usableUsername(username, provider, id),
    email,
    profileImageUrl,
  });
  await user.save();
  return user;
}

if (providers.github) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      done(null, await findOrCreateOAuthUser({
        provider: "github",
        id: profile.id,
        username: profile.username || profile.displayName,
        emailInfo: profile.emails?.[0],
        profileImageUrl: profile.photos?.[0]?.value,
      }));
    } catch (error) {
      done(error);
    }
  }));
}

if (providers.google) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      done(null, await findOrCreateOAuthUser({
        provider: "google",
        id: profile.id,
        username: profile.displayName,
        emailInfo: profile.emails?.[0],
        profileImageUrl: profile.photos?.[0]?.value,
      }));
    } catch (error) {
      done(error);
    }
  }));
}

passport.oauthProviders = providers;
module.exports = passport;
