const express = require("express");
const AuthController = require("../controllers/AuthController");

const router = express.Router();

router.post("/register", (req, res) => AuthController.register(req, res));
router.post("/login", (req, res) => AuthController.login(req, res));

module.exports = router;