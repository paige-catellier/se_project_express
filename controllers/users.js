const User = require("../models/user");
const { ERROR_400, ERROR_404, ERROR_500 } = require("../utils/errors");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_500)
        .send({ message: "An error occurred on the server" });
    });
};

const createUser = async (req, res) => {
  const { name, avatar } = req.body;
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  User.create({ name, avatar, email, password: hashedPassword })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(ERROR_409).send({ message: "Email already exists" });
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(ERROR_400).send({ message: "Inavlid data" });
      }
      return res
        .status(ERROR_500)
        .send({ message: "An error has occurred on the server" });
    });
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
        .send({ message: "An error had occurred on the server" });
    });
};

const login = (req, res) => {
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

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
};
