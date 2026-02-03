const router = require("express").Router();
const { getUsers } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", () => console.log("GET users by ID"));
router.post("/users", () => console.log("POST users"));

module.exports = router;
