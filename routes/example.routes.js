const router = require("express").Router();
const User = require("../models/User.model");
const Card = require("../models/Card.model");

router.get("/projects", async (req, res) => {

    try {
        const response = await Project.find().populate("tasks");
        res.status(200).json(response);
    }
    catch (e) {
        res.status(500).json({message: e})
        
    }

});

router.post("/projects", async (req, res) => {
    try {
        const {title, description} = req.body;
        if (!title || !description) {
            res.status(400).json({message: "missing fields"})
        }
        await Project.create({title, description});
        res.status(200).json(response);
    }
    catch (e) {

    }
})

router.delete("/projects/:projectId", async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.projectId);
        res.status(200).json({message: "Project deleted"})
    }
    catch (e) {
res.status(500).json({message:e})
    }
})

router.get("/projects:projectId", async (req, res) => {
    try {
      const response = await Project.findById(req.params.projectId).populate("tasks");
        res.status(200).json(response);
    }
    catch (e) {
        res.status(500).json({message:e})
            }
})

router.put("/projects/:projectId", async (req, res) => {
    try {
        const {title, description } = req.body;
        const response = await Project.findByIdAndUpdate({title, description}, {new: true});
        res.status(200).json(response);
    }
    catch (e) {
        res.status(500).json({message:e})
            }
})

router.post("/tasks", async (req, res) => {
    try {
        const {title, description, projectId } = req.body;
        const projectResponse = await Task.create({title, description});
        await Project.findByIdAndUpdate(projectId, { $push: {tasks: response._id}});
        res.status(200).json(projectResponse)
    }
    catch (e) {
        res.status(500).json({message:e})
            }
})
module.exports = router;