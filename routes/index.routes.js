const router = require("express").Router();
const authRoutes = require("./auth.routes");
const cardRoutes = require("./card.routes");
const userRoutes = require("./user.routes");
const deckRoutes = require("./deck.routes");

/* GET home page */
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/cards", cardRoutes);
router.use("/decks", deckRoutes);



module.exports = router;
