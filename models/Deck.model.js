const { Schema, model } = require("mongoose");

const deckSchema = new Schema(
    {
        name: String,
        cards: [{type: Schema.Types.ObjectId, ref: "Card"}],
        difficulty: String,
        description: String,
        image: String
    }
)
const Deck = model("Deck", deckSchema);

module.exports = Deck;