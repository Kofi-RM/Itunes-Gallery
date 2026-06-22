// Mongoose schema for users.
// Supports both local email/password accounts and GitHub OAuth users.
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const {Schema} = mongoose;

const userSchema = new Schema({
    username: {
 type: String,
    required: true,
    minlength: 4,
    },
    password: {
 type: String,
    
    minlength: 8,
    },
    email: {
 type: String,
     required: function () {
    return !this.githubId;
  },
    minlength: 8,
    unique: true,
    },
    githubId: {
type:String,
    }
}, {
    timestamps:true
})

userSchema.pre("save", async function (next) {
       try {
    // Skip password hashing for users who signed up with GitHub OAuth.
    if (!this.password) return;

    // Only hash when the password field is new or changed.
    if (!this.isModified("password")) return;

    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);

    
  } catch (err) {
    console.log(err)
  }
})

// Compare a plain-text password to the hashed password stored in the database.
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
 

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;