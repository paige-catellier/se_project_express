const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
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
          return res.status(400).send({ message: err.message });
        }
        return res.status(500).send({ message: err.message });
      });
  });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.staus(500).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
};
