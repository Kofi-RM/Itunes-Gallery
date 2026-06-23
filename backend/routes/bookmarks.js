
const router = require("express").Router();

const Item = require("../models/Item")

const {authMiddleware} = require("../util/auth")

router.get('/bookmarks', authMiddleware, async (req, res) => {
    try {
        const bookmarks = await Item.find({
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
    const bookmark = await Project.create({
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
module.exports = router;