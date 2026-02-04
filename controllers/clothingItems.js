const Item = require("../models/clothingItem");
const { ERROR_400, ERROR_404, ERROR_500 } = require("../utils/errors");

const getClothingItems = (req, res) => {
  Item.find({})
    .orFail()
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_500)
        .send({ message: "An error occurred on the server" });
    });
};

const createClothingItem = (req, res) => {
  const { name, imageUrl, weatherType, owner, likes, createdAt } = req.body;

  Item.create({
    name,
    imageUrl,
    weatherType,
    owner: req.user._id,
    likes,
    createdAt,
  }).then((item) => {
    res
      .status(201)
      .send(item)
      .catch((err) => {
        console.error(err);
        if (err.name === "ValidationError") {
          return res.status(ERROR_400).send({ message: err.message });
        }
        return res.status(ERROR_500).send({ message: err.message });
      });
  });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        return res
          .status(ERROR_404)
          .send({ message: "Clothing item not found" });
      }
      return res.status(ERROR_500).send({ message: err.message });
    });
};

const likeClothingItem = (req, res) => {
  const userId = req.user._id;
  const itemId = req.params.itemId;

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
      rror;
      if (err.name === "Clothing item not found") {
        return res.status(ERROR_404).send({ message: err.message });
      }
      return res.status(ERROR_500).send({ message: err.message });
    });
};

const unlikeClothingItem = (req, res) => {
  const userId = req.user._id;
  const itemId = req.params.itemId;

  Item.findByIdAndDelete(itemId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((updatedItem) => {
      res.send(updatedItem);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "Clothing item not found") {
        return res.status(ERROR_404).send({ message: err.message });
      }
      return res.status(ERROR_500).send({ message: err.message });
    });
};

module.exports = {
  getClothingItems,
  deleteClothingItem,
  createClothingItem,
  likeClothingItem,
  unlikeClothingItem,
};
