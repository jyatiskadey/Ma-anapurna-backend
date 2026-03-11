const express = require("express");
const router = express.Router();
const { saveCollection, getCollectionsByDate, getTodayTotalCollection } = require("../controllers/collectionController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", saveCollection);
router.get("/today-total", getTodayTotalCollection);
router.get("/by-date", getCollectionsByDate);

module.exports = router;