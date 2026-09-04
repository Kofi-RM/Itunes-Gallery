const router = require("express").Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  const { term, media, limit = "36" } = req.query;
  const count = Number(limit);
  const allowedMedia = ["music", "podcast", "musicVideo", "tvShow", "software", "ebook"];
  if (typeof term !== "string" || !term.trim() || term.length > 200 ||
      !allowedMedia.includes(media) || !Number.isInteger(count) || count < 1 || count > 200) {
    return res.status(400).json({ message: "Invalid search parameters." });
  }
  try {
    const response = await axios.get("https://itunes.apple.com/search", {
      params: { term: term.trim(), media, limit: count },
      timeout: 10000,
    });
    res.json(response.data);
  } catch {
    res.status(502).json({ message: "Search is temporarily unavailable. Please try again." });
  }
});

module.exports = router;
