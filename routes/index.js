const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.use("/items", itemRouter);

router.use("/users", userRouter);

module.exports = router;
