const express = require("express");
const router = express.Router();
const { saveCollection } = require("../controllers/collectionController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, saveCollection);

module.exports = router;