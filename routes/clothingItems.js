const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.post("/items", createClothingItem);
router.delete("/items/:itemId", deleteClothingItem);

module.exports = router;
