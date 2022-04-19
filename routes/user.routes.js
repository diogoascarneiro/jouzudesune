const router = require("express").Router();
const User = require("../models/User.model");
const Card = require("../models/Card.model");

/* Base routes */

// Get all users
router.get("/", async (req, res) => {

    try {
        const response = await User.find();
        res.status(200).json(response);
    }
    catch (e) {
        res.status(500).json({message: e})
        
    }

});

// Get specific user
router.get("/:userId", async (req, res) => {
    try {
      const response = await User.findById(req.params.userId);
        res.status(200).json(response);
    }
    catch (e) {
        res.status(500).json({message:e})
            }
})

// Delete user
router.delete("/:userId", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json({message: "User deleted"})
    }
    catch (e) {
res.status(500).json({message:e})
    }
})

// Update user
router.put("/:userId", async (req, res) => {
    try {
        const {username, email, password, profilePicture, cards, decks} = req.body;
        const response = await User.findByIdAndUpdate(req.params.userId, {username, email, password, profilePicture, cards, decks}, {new: true});
        res.status(200).json(response);
    }
    catch (e) {
        res.status(500).json({message:e})
            }
})

module.exports = router;