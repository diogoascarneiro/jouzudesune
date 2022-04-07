const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
   username: {
      type: String,
      trim: true,
      required: [true, 'Username is required'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    profilePicture: {
      type: String,
      default: "/images/profic.png"
    },
    cards: [{
        id: {type: Schema.Types.ObjectId, ref: "Card"},
       timesSeen: {type: Number, default: 0},
       score: {type: Number}
    }],
    decks: [{
      id: {type: Schema.Types.ObjectId, ref: "Deck"},
      timesSeen: {type: Number, default: 0},
      score: {type: Number}
    }]
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;