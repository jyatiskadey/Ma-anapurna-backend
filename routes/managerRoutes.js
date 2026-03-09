const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/managerController");

// Manager register & login
router.post("/register", register);
router.post("/login", login);

module.exports = router;