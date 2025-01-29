const userController = require("../controllers/userController");

const userRouter = require("express").Router();

userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);

module.exports = userRouter;
