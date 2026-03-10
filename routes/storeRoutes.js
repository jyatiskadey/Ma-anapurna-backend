const express = require("express");
const router = express.Router();
const { addStore, getStores, updateStoreStatus, updateStore, deleteStore } = require("../controllers/storeController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, addStore);
router.get("/", getStores);
router.patch("/:storeId/status", verifyToken, updateStoreStatus);
router.put("/:storeId", verifyToken, updateStore);
router.delete("/:storeId", verifyToken, deleteStore);


module.exports = router;