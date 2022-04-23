const router = require("express").Router();
const User = require("../models/User.model");
const Card = require("../models/Card.model");

/* Base routes */

// Get all users
router.get("/", async (req, res) => {
  try {
    const response = await User.find();
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

// Get specific user
router.get("/:userId", async (req, res) => {
  try {
    const response = await User.findById(req.params.userId);
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

// Delete user
router.delete("/:userId", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User deleted" });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

// Update user
router.put("/:userId", async (req, res) => {
  try {
    const { username, email, password, profilePicture, cards, decks } =
      req.body;
    const response = await User.findByIdAndUpdate(
      req.params.userId,
      { username, email, password, profilePicture, cards, decks },
      { new: true }
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

// Update user decks

router.get("/:userId/decks/:deckId", async (req, res) => {
  try {
    const response = await User.findById(req.params.userId);
    const deckInfo = response.decks.find(
      (elem) => elem.deckId == req.params.deckId
    );
    if (!deckInfo) {
      res.status(204).json({message: "No such deck"});
    } else {
      res.status(200).json(deckInfo);
    }
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

router.put("/:userId/decks/:deckId", async (req, res) => {
  try {
    const deck = req.body;
    const response = await User.findById(req.params.userId);
    const deckInfo = response.decks.find(
      (elem) => elem.deckId == req.params.deckId
    );
    if (!deckInfo) {
      const updateResponse = await User.findByIdAndUpdate(
        req.params.userId,
        { $push: { decks: deck } },
        { new: true }
      );
      console.log('deck', deck);
      console.log('updateResponse', updateResponse);
      res.status(200).json(updateResponse);
    } else {
      const updateResponse = await User.findOneAndUpdate(
        { _id: req.params.userId, "decks.deckId": req.params.deckId },
        {
          $set: {
            "decks.$.deckId": deck.deckId,
            "decks.$.timesPlayed": deck.timesPlayed,
            "decks.$.highScore": deck.highScore,
          },
        },
        { new: true }
      );
      res.status(200).json(updateResponse);
    }
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

// Update user cards

router.put("/:userId/updateCardData", async (req, res) => {
  try {
    const { cards } = req.body;
    const response = await User.findByIdAndUpdate(
      req.params.userId,
      { cards },
      { new: true }
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});


module.exports = router;
