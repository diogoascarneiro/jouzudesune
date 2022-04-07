const router = require("express").Router();
const authRoutes = require("./auth.routes");
const cardRoutes = require("./card.routes");
const userRoutes = require("./user.routes");
const deckRoutes = require("./deck.routes");
const fileUpload = require("../config/cloudinary");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.post("/upload", fileUpload.single("file"), async (req, res) => {
  try {
      res.status(200).json({fileUrl: req.file.path})
  }
  catch (e) {
      res.status(500).status({message: e.message});
  }
})

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/cards", cardRoutes);
router.use("/decks", deckRoutes);



module.exports = router;
