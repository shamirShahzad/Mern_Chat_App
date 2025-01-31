const Group = require("../models/GroupModel");

const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await Group.create({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id],
    });
    const populatedGroup = await Group.findById(group._id)
      .populate("admin", "username email")
      .populate("members", "username email");
    res.status(201).json({ populatedGroup });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    if (!groups) {
      res.status(404).json({ message: "No groups found" });
    }
    res.json(groups);
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
};

const groupController = { createGroup, getGroups };

module.exports = groupController;
