const router = require("express").Router();
const Card = require("../models/Card.model");

router.get("/", async (req, res) => {
  try {
    const response = await Card.find();
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      cardNumber,
      questionWord,
      wordWithFurigana,
      wordInKana,
      wordMeanings,
      wordAudio,
      exampleSentence,
      exampleWithFurigana,
      exampleInKana,
      exampleTranslation,
      exampleClozed,
      exampleAudio,
      difficulty,
    } = req.body;

    // if (!title || !description) {
    //     res.status(400).json({message: "missing fields"})
    // }
    await Card.create({
      cardNumber,
      questionWord,
      wordWithFurigana,
      wordInKana,
      wordMeanings,
      wordAudio,
      exampleSentence,
      exampleWithFurigana,
      exampleInKana,
      exampleTranslation,
      exampleClozed,
      exampleAudio,
      difficulty,
    });
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

router.get("/:cardId", async (req, res) => {
  try {
    const response = await Card.findById(req.params.cardId);
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

router.delete("/:cardId", async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.cardId);
    res.status(200).json({ message: "Card deleted" });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

router.put("/:cardId", async (req, res) => {
  let id = req.params.cardId;
  try {
    const {
      cardNumber,
      questionWord,
      wordWithFurigana,
      wordInKana,
      wordMeanings,
      wordAudio,
      exampleSentence,
      exampleWithFurigana,
      exampleInKana,
      exampleTranslation,
      exampleClozed,
      exampleAudio,
      difficulty,
    } = req.body;
    const response = await Card.findByIdAndUpdate(
      id,
      {
        cardNumber,
        questionWord,
        wordWithFurigana,
        wordInKana,
        wordMeanings,
        wordAudio,
        exampleSentence,
        exampleWithFurigana,
        exampleInKana,
        exampleTranslation,
        exampleClozed,
        exampleAudio,
        difficulty,
      },
      { new: true }
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

module.exports = router;
