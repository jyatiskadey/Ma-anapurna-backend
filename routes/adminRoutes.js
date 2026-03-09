const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/adminController");
const { getManagers, updateManager, deleteManager } = require("../controllers/managerController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// Manager management (admin only)
router.get("/managers", verifyToken, getManagers);
router.put("/managers/:id", verifyToken, updateManager);
router.delete("/managers/:id", verifyToken, deleteManager);

module.exports = router;
