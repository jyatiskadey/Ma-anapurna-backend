const express = require("express");
const router = express.Router();
const { saveCollection, getCollectionsByDate } = require("../controllers/collectionController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, saveCollection);
router.get("/by-date", verifyToken, getCollectionsByDate);

module.exports = router;