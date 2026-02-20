const router = require("express").Router();
const {
  createUser,
  getCurrentUser,
  login,
  updateProfile,
} = require("../controllers/users");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

router.post("/signup", createUser);
router.post("/signin", login);

router.get("/items", getClothingItems);
router.post("/items", auth, createClothingItem);
router.delete("/items/:id", auth, deleteClothingItem);
router.put("/items/:id/likes", auth, likeClothingItem);
router.delete("/items/:id/likes", auth, unlikeClothingItem);

router.get("/users/me", auth, getCurrentUser);
router.patch("/users/me", auth, updateProfile);

module.exports = router;
