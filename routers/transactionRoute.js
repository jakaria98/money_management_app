const router = require("express").Router;
const {
  getAll,
  create,
  update,
  getSingleTransaction,
  remove,
} = require("../controllers/transactionController");
const authenticate = require('../authenticate')
router.get("/", authenticate, getAll);
router.post("/", authenticate, create);
router.get("/:transactionId", getSingleTransaction);
router.put("/:transactionId", update);
router.delete("/:transactionId", remove);

module.exports = router;
