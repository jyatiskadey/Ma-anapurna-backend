const express = require("express");
const router = express.Router();
const { register, login, downloadDailyReport } = require("../controllers/managerController");

// Manager register & login
router.post("/register", register);
router.post("/login", login);
router.get("/download-report", downloadDailyReport);

module.exports = router;