const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            res.status(400).json({ message: "missing fields" });
            return;
        }

        const foundUser = await User.findOne({ username });
        if (foundUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const createdUser = await User.create({ email, username, password: hashedPassword });

        res.status(200).json({ email: createdUser.email, username: createdUser.username, _id: createdUser._id });
    }

    catch (e) {
        res.status(500).json({ message: e.message })
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ message: "missing fields" })
        return;
    }

    const foundUser = await User.findOne({ username });
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
        { _id: foundUser._id, email: foundUser.email, username: foundUser.username },
        process.env.TOKEN_SECRET,
        { algorithm: "HS256", expiresIn: "6h" }
    )

    res.status(200).json({ authToken });

});

module.exports = router;