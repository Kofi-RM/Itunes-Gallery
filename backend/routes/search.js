
const router = express.Router();



router.get("/api/search", async (req, res) => {
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