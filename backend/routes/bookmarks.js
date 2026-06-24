
const router = require("express").Router();

const Bookmark = require("../models/Bookmark");


const {authMiddleware} = require("../util/auth")

router.get('/', authMiddleware, async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({
            user:req.user._id})
            console.log(bookmarks)
            res.json(bookmarks)
    } catch (err) {
res.status.apply(400).json({
    error:err.message})
    }
    })

    // make project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const bookmark = await Bookmark.create({
        ...req.body,
        user: req.user._id
  });
   
    res.status(201).json({ bookmark });
  } catch (err) {
   res.status(400).json({
  error: err.message
});
  }
});

router.delete("/:trackId", authMiddleware, async (req,res) => {
    try {
 const bookmark =  await Bookmark.findOneAndDelete({
    trackId: Number(req.params.trackId)
  });


    if (!bookmark) {
      return res.status(404).json({
        message: 'Bookmark not found'
      });
    }
    res.status(200).json({ message: "Bookmark deleted" });

    } catch (err) {
 res.status(500).json({
      message: err.message
    });
    }
} )
module.exports = router;