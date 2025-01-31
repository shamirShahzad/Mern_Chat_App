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
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) {
      res.status(404).json({ message: "Group not found" });
    }
    if (group.members.includes(req.user._id)) {
      res.status(400).json({ message: "User already in group" });
    }
    group.members.push(req.user._id);
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }
    if (!group.members.includes(req.user._id)) {
      return res.status(400).json({ message: "User not in group" });
    }
    const index = group.members.indexOf(req.user._id);
    group.members.splice(index, 1);
    await group.save();
    res.json(group);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const groupController = { createGroup, getGroups, joinGroup, leaveGroup };

module.exports = groupController;
