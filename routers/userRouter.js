const router = require("express").Router();
const { login, register } = require("../controllers/userController");
//registration
router.post("/register", register);
//login
router.post("/login", login);
module.exports = router;
