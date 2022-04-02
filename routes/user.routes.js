const router = require("express").Router();
const User = require("../models/User.model");
const Card = require("../models/Card.model");

router.get("/", async (req, res) => {

    try {
        const response = await User.find();
        res.status(200).json(response);
    }
    catch (e) {
        res.status(500).json({message: e})
        
    }

});

router.delete("/:userId", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json({message: "User deleted"})
    }
    catch (e) {
res.status(500).json({message:e})
    }
})

router.get("/:userId", async (req, res) => {
    try {
      const response = await User.findById(req.params.userId);
        res.status(200).json(response);
    }
    catch (e) {
        res.status(500).json({message:e})
            }
})

router.put("/:userId", async (req, res) => {
    try {
        const {username, email, passwordHash, profilePicture} = req.body;
        const response = await User.findByIdAndUpdate(req.params.userId, {username, email, passwordHash, profilePicture}, {new: true});
        res.status(200).json(response);
    }
    catch (e) {
        res.status(500).json({message:e})
            }
})

module.exports = router;