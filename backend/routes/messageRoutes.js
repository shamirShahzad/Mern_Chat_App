const messageController = require("../controllers/messageController");
const messageRouter = require("express").Router();
const { protect } = require("../middleware/authMiddleware");

messageRouter.post("/", protect, messageController.sendMessage);
messageRouter.get("/:groupId", protect, messageController.getAllMessages);

module.exports = messageRouter;
