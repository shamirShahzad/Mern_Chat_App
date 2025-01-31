const groupRouter = require("express").Router();
const groupController = require("../controllers/groupController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

groupRouter.post("/", protect, isAdmin, groupController.createGroup);
groupRouter.get("/", protect, groupController.getGroups);
groupRouter.post("/:groupId/join", protect, groupController.joinGroup);
groupRouter.post("/:groupId/leave", protect, groupController.leaveGroup);

module.exports = groupRouter;
