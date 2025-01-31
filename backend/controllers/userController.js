const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
    }
    const newUser = await User.create({
      email,
      username,
      password,
    });
    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        isAdmin: newUser.isAdmin,
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });
    if (!userFound) {
      res.status(404).json({ message: "User does not exist" });
    }
    if (await userFound.matchPassword(password)) {
      res.json({
        user: {
          _id: userFound._id,
          email: userFound.email,
          username: userFound.username,
          isAdmin: userFound.isAdmin,
          token: generateToken(userFound._id),
        },
      });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const userController = {
  registerUser,
  loginUser,
};

module.exports = userController;
