const groupRouter = require("express").Router();
const groupController = require("../controllers/groupController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

groupRouter.post("/", protect, isAdmin, groupController.createGroup);

module.exports = groupRouter;
