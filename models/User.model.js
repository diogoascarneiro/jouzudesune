const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Username is required"],
      unique: true,
    },
    userType: String,
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profilePicture: {
      type: String,
      default: "/img/placeholderProfilePic.png",
    },
    cards: [
      {
        cardId: { type: Schema.Types.ObjectId, ref: "Card" },
        timesSeen: { type: Number, default: 0 },
        score: { type: Number },
        averageScore: Number
      },
    ],
    decks: [
      {
        deckId: { type: Schema.Types.ObjectId, ref: "Deck" },
        timesPlayed: { type: Number, default: 0 },
        highScore: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
