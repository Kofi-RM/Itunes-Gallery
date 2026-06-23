const express = require("express");
const router = express.Router();
const User = require("../models/User");
const upload = require("../util/upload"); // multer config

router.post("/upload-profile/:id", upload.single("image"), async (req, res) => {
  try {
    const userId = req.params.id;

    // Cloudinary gives you this automatically
    const imageUrl = req.file.path;

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImageUrl: imageUrl },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;