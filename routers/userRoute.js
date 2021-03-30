const router = require("express").Router();
const { login, register, allUser } = require("../controllers/userController");
//registration
router.post("/register", register);
//login
router.post("/login", login);
router.get("/all", allUser);
module.exports = router;
