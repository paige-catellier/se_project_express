const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItems");
const { validateCardBody, validateIDs } = require("../middlewares/validation");

router.get("/", getClothingItems);
router.use(auth);
router.post("/", validateCardBody, createClothingItem);
router.delete("/:itemId", validateIDs, deleteClothingItem);
router.put("/:itemId/likes", validateIDs, likeClothingItem);
router.delete("/:itemId/likes", validateIDs, unlikeClothingItem);

module.exports = router;
