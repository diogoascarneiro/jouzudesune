const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, username, profilePicture } = req.body;

    if (!email || !password || !username) {
      res.status(400).json({ message: "missing fields" });
      return;
    }

    const foundUser = await User.findOne({ username });
    if (foundUser) {
      res.status(400).json({ message: "user already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const createdUser = await User.create({
      email,
      username,
      userType: 'user',
      password: hashedPassword,
      profilePicture,
    });

    res
      .status(200)
      .json({
        email: createdUser.email,
        username: createdUser.username,
        userType: createdUser.userType,
        _id: createdUser._id,
        profilePicture: createdUser.profilePicture,
      });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "missing fields" });
    return;
  }

  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    res.status(401).json({ message: "invalid login" });
    return;
  }

  const correctPassword = bcrypt.compareSync(password, foundUser.password);

  if (!correctPassword) {
    res.status(401).json({ message: "invalid login" });
    return;
  }

  //delete foundUser.password;
  const authToken = jwt.sign(
    {
      _id: foundUser._id,
      email: foundUser.email,
      username: foundUser.username,
      profilePicture: foundUser.profilePicture,
      cards: foundUser.cards,
      decks: foundUser.decks
    },
    process.env.TOKEN_SECRET,
    { algorithm: "HS256", expiresIn: "6h" }
  );

  res.status(200).json({ authToken });
});

router.get("/verify", isAuthenticated, async (req, res) => {
  const foundUser = await User.findOne({ username: req.payload.username });
  req.payload.cards = foundUser.cards;
  req.payload.decks = foundUser.decks;
  res.status(200).json(req.payload);
});

module.exports = router;
