const { Schema, model } = require("mongoose");

const deckSchema = new Schema(
    {
        name: String,
        cards: [{type: Schema.Types.ObjectId, ref: "Card"}],
        difficulty: Number,
        description: String,
        image: {type: String, default: "/img/decks/default.jpg"}
    }
)
const Deck = model("Deck", deckSchema);

module.exports = Deck;