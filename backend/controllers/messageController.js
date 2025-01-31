const Chat = require("../models/ChatModel");
const socketIo = require("../socket");

const sendMessage = async (req, res) => {
  try {
    const { content, group } = req.body;
    console.log(content, group);
    const message = await Chat.create({
      sender: req.user._id,
      content,
      group,
    });
    const populatedMessage = Chat.findById(message._id).populate(
      "sender",
      "username email"
    );
    res.json(populatedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await Chat.find({ group: groupId })
      .populate("sender", "username email")
      .sort({ createdAt: -1 });
    if (!messages) {
      return res.status(404).json({ message: "No messages found" });
    }
    res.json(messages);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const messageController = { sendMessage, getAllMessages };
module.exports = messageController;
