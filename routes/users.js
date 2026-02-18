const router = require("express").Router();
const {
  getUsers,
  createUser,
  getCurrentUser,
  login,
} = require("../controllers/users");
const { getClothingItems } = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");
const { get } = require("mongoose");

//protect routes with auth: get users/me patch users/me post /items delete /items/:id
// put /items/:id/likes delete /items/:id/likes //

router.post("/signup", createUser);
router.post("/signin", login);
router.get("/items", getClothingItems);

router.get("/users/me", auth, getCurrentUser);

module.exports = router;
