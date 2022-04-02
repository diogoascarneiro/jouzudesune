const { Schema, model } = require("mongoose");
//const mongooseRandom = require("mongoose-simple-random");

const cardSchema = new Schema (
    {
       cardNumber: {
           type: Number,
           unique: true
       },
       questionWord: String,
       wordWithFurigana: String,
       wordInKana: String,
       wordMeanings: String,
       wordAudio: String,
       exampleSentence: String,
       exampleWithFurigana: String,
       exampleInKana: String,
       exampleTranslation: String,
       exampleClozed: String,
       exampleAudio: String,
       difficulty: String
                  }
      

)

//cardSchema.plugin(mongooseRandom);
const Card = model("Card", cardSchema);

module.exports = Card;