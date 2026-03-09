const express = require("express");
const router = express.Router();
const { addStore, getStores, updateStoreStatus } = require("../controllers/storeController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, addStore);
router.get("/",  getStores);
router.patch("/:storeId/status", verifyToken, updateStoreStatus);


module.exports = router;