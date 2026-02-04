const User = require("../models/user");
const { ERROR_400, ERROR_404, ERROR_500 } = require("../utils/errors");

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

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar }).then((user) => {
    res
      .status(201)
      .send(user)
      .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          return res.status(ERROR_400).send({ message: err.message });
        }
        return res.status(ERROR_500).send({ message: err.message });
      });
  });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_404).send({ message: "User not found" });
      }
      return res.staus(ERROR_500).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
};
