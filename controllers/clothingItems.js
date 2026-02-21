const Item = require("../models/clothingItem");
const {
  ERROR_400,
  ERROR_401,
  ERROR_404,
  ERROR_403,
  ERROR_500,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_500)
        .send({ message: "An error occurred on the server" });
    });
};

const createClothingItem = (req, res) => {
  if (!req.user) {
    return res.status(ERROR_401).send({ message: "Authorization required" });
  }
  const { name, imageUrl, weather } = req.body;

  Item.create({
    name,
    imageUrl,
    weather,
    owner: req.user._id,
  })
    .then((item) => {
      return res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(ERROR_400).send({ message: "Invalid data" });
      }
      return res
        .status(ERROR_500)
        .send({ message: "An error occurred on the server" });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(ERROR_403)
          .send({ message: "You do not have permission to delete this item" });
      }
      return Item.findByIdAndDelete(itemId)
        .orFail()
        .then((item) => {
          res.status(200).send(item);
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_404).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_400).send({ message: "Invalid data" });
      }
      return res
        .status(ERROR_500)
        .send({ message: "An error occurred on the server" });
    });
};

const likeClothingItem = (req, res) => {
  const { _id: userId } = req.user;
  const { itemId } = req.params;

  Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((updatedItem) => {
      res.send(updatedItem);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_404).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_400).send({ message: "Invalid data" });
      }
      return res
        .status(ERROR_500)
        .send({ message: "An error occurred on the server" });
    });
};

const unlikeClothingItem = (req, res) => {
  const { _id: userId } = req.user;
  const { itemId } = req.params;

  Item.findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((updatedItem) => {
      res.send(updatedItem);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_404).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_400).send({ message: "Invalid data" });
      }
      return res
        .status(ERROR_500)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  getClothingItems,
  deleteClothingItem,
  createClothingItem,
  likeClothingItem,
  unlikeClothingItem,
};
