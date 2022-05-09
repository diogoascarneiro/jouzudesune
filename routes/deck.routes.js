const router = require("express").Router();
const Deck = require("../models/Deck.model");
const Card = require("../models/Card.model");
const User = require("../models/User.model");

router.get("/", async (req, res) => {
  try {
    const response = await Deck.find();
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      name, cards
    } = req.body;

    // if (!title || !description) {
    //     res.status(400).json({message: "missing fields"})
    // }
    const response = await Deck.create({
        name, cards
    });
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }

});
router.get("/random", async (req, res) => {
  const {type, number, userId} = req.query;
  try {
    let response;
    if (type === "random") response = await Card.aggregate([{$sample: {size:Number(number)}}]);
    if (type === "seenLowFirst") {
      userResponse = await User.findById(userId).populate("cards.cardId").select("cards -_id");
      const sortedByLowAvgScore = userResponse.cards.sort((a, b) => a.averageScore - b.averageScore);
      response = sortedByLowAvgScore.slice(0, number);
    }
    if (type === "seenRandom") {
      userResponse = await User.findById(userId).populate("cards.cardId").select("cards -_id");
      const shuffledCardList = userResponse.cards.sort(() => 0.5 - Math.random());
      response = shuffledCardList.slice(0, number);
    }
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

router.get("/:deckId", async (req, res) => {
  try {
    const response = await Deck.findById(req.params.deckId).populate("cards");
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

router.delete("/:deckId", async (req, res) => {
  try {
    await Deck.findByIdAndDelete(req.params.deckId);
    res.status(200).json({ message: "Deck deleted" });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

router.put("/:deckId", async (req, res) => {
  let id = req.params.deckId;
  try {
    const {
      name, cards
    } = req.body;
    const response = await Deck.findByIdAndUpdate(
      id,
      {
        name, cards
      },
      { new: true }
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});


module.exports = router;
