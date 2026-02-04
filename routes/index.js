const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { ERROR_404 } = require("../utils/errors");

router.use("/items", itemRouter);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(ERROR_404).send({ message: "Requested resource not found" });
});

module.exports = router;
