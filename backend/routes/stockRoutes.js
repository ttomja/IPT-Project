const express = require("express");
const {
  stockIn,
  stockOut,
  getTransactions,
} = require("../controllers/stockController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.use(protect);
router.post("/in", stockIn);
router.post("/out", stockOut);
router.get("/transactions", getTransactions);
module.exports = router;
