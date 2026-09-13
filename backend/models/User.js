// Mongoose schema for local, GitHub, and Google accounts.
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, minlength: 4 },
  password: {
    type: String,
    required: function () { return !this.githubId && !this.googleId; },
    minlength: 8,
  },
  email: {
    type: String,
    required: function () { return !this.githubId && !this.googleId; },
    minlength: 8,
    unique: true,
    sparse: true,
  },
  githubId: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  profileImageUrl: { type: String },
}, { timestamps: true });

userSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isCorrectPassword = async function (password) {
  if (!this.password || typeof password !== "string") return false;
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
