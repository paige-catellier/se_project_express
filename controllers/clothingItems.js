const Item = require("../models/clothingItem");

const getClothingItems = (req, res) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .send({ message: "An error occurred on the server" });
    });
};

const createClothingItem = (req, res) => {
  const { name, imageUrl, weatherType, owner, likes, createdAt } = req.body;

  Item.create({ name, imageUrl, weatherType, owner, likes, createdAt }).then(
    (item) => {
      res
        .status(201)
        .send(item)
        .catch((err) => {
          console.error(err);
          if (err.name === "ValidationError") {
            return res.status(400).send({ message: err.message });
          }
          return res.status(500).send({ message: err.message });
        });
    }
  );
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Clothing item not found" });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = {
  getClothingItems,
  deleteClothingItem,
};
module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);
};
