const express = require("express");
const router = express.Router();
const { saveCollection, getCollectionsByDate } = require("../controllers/collectionController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/",  saveCollection);
router.get("/by-date",  getCollectionsByDate);

module.exports = router;