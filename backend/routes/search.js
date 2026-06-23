
const router = require("express").Router()
const axios = require("axios")


router.get("/", async (req, res) => {
  const { term, media } = req.query;

  const response = await axios.get(
    "https://itunes.apple.com/search",
    {
      params: {
        term,
        media,
        limit: 36,
      },
    }
  );

  res.json(response.data);
});

module.exports = router;