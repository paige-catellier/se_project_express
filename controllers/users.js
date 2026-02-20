const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  ERROR_400,
  ERROR_401,
  ERROR_404,
  ERROR_500,
  ERROR_409,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(201).send(userWithoutPassword);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(ERROR_409).send({ message: "Email already exists" });
    }
    if (err.name === "ValidationError") {
      return res.status(ERROR_400).send({ message: "Invalid data" });
    }
    console.error(err);
    return res
      .status(ERROR_500)
      .send({ message: "An error has occurred on the server" });
  }
};

const getCurrentUser = (req, res) => {
  const { userId } = req.user;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_404).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_400).send({ message: "Invalid data" });
      }
      return res
        .status(ERROR_500)
        .send({ message: "An error has occurred on the server" });
    });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_401)
        .send({ message: "Incorrect email or password" });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_404).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(ERROR_400).send({ message: "Invalid data" });
      }
      return res
        .status(ERROR_500)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateProfile,
};
