const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const {
  validateLogin,
  validateUserBody,
} = require("../middlewares/validation");
const NotFoundError = require("../errors/not-found-err");

router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateLogin, login);

router.use("/items", itemRouter);

router.use("/users", userRouter);

router.use((_req, _res, next) => {
  return next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
