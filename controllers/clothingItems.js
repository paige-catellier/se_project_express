const Item = require("../models/clothingItem");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const UnauthorizedError = require("../errors/unathorized-err");
const ForbiddenError = require("../errors/forbidden-err");

const getClothingItems = (_req, res, next) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

const createClothingItem = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError("Authorization required"));
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
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return next(
          new ForbiddenError("You do not have permission to delete this item")
        );
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
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
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
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
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
        return next(new NotFoundError("Itemm not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

module.exports = {
  getClothingItems,
  deleteClothingItem,
  createClothingItem,
  likeClothingItem,
  unlikeClothingItem,
};
