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
    const response = await User.findById(req.params.userId).populate(["decks.deckId", "cards.cardId"]);
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
      res.status(204).json({ message: "No such deck" });
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

router.get("/:userId/cards/:cardId", async (req, res) => {
  try {
    const response = await User.findById(req.params.userId);
    const cardInfo = response.cards.find(
      (elem) => elem.cardId == req.params.cardId
    );
    if (!cardInfo) {
      res.status(204).json({ message: "No such card" });
    } else {
      res.status(200).json(cardInfo);
    }
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

router.put("/:userId/cards/:cardId", async (req, res) => {
  try {
    const card = req.body;
    const response = await User.findById(req.params.userId);
    const cardInfo = response.cards.find(
      (elem) => elem.cardId == req.params.cardId
    );
    if (!cardInfo) {
      const updateResponse = await User.findByIdAndUpdate(
        req.params.userId,
        { $push: { cards: card } },
        { new: true }
      );
      res.status(200).json(updateResponse);
    } else {
      const updateResponse = await User.findOneAndUpdate(
        { _id: req.params.userId, "cards.cardId": req.params.cardId },
        {
          $set: {
            "cards.$.cardId": card.cardId,
            "cards.$.timesSeen": card.timesSeen,
            "cards.$.score": card.score,
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

// this updates a deck's worth of cards all at once to avoid unecessary calls to the db

router.put("/:userId/cards/", async (req, res) => {
  try {
    const cardsPayload = req.body;
    // const matchingCards = [];
    // const nonMatchingCards = [];
    const response = await User.findById(req.params.userId);

    const newUserCardsArray = [...response.cards];
    const userSeenCardIds = {};

    /* First we need to check which of the cards we're adding/updating are already
       part of the user.cards array and which aren't, then add the "timesSeen & score" values accordingly.
       Passing these values to the userSeenCardIds array serves both as a "true" value and
       as a way to update them on the right cards.
       Finally we remove the identical cards from the user-cards array, push the new ones, 
       clean it up and boom.
    */

       /* 
       Need to change score to highScore and create an averageScore field.
       */
    response.cards.forEach(
      (card) => (userSeenCardIds[`${card.cardId}`] = {
        timesSeen: card.timesSeen,
        averageScore: card.averageScore,
        score: card.score
      })
    );
    cardsPayload.forEach((card) => {
      let updatedCard = { ...card };
      updatedCard.timesSeen = 1;
      let accumScore = (card.timesSeen * card.averageScore) || card.score;
      if (userSeenCardIds[`${card.cardId}`]) {
        updatedCard.timesSeen += userSeenCardIds[`${card.cardId}`].timesSeen;
        newUserCardsArray.splice(newUserCardsArray.findIndex((elem) => elem.cardId == card.cardId), 1);
      } 
      updatedCard.averageScore = accumScore / updatedCard.timesSeen;
      console.log(updatedCard);
      newUserCardsArray.push(updatedCard);
    });
   
    const updateResponse = await User.findByIdAndUpdate(
      req.params.userId,
      { cards: newUserCardsArray },
      { new: true }
    );
    res.status(200).json(updateResponse);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
