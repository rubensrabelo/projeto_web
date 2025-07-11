const express = require("express");
const AuthService = require("../services/AuthService");

const router = express.Router();

router.post("/register", (req, res) => AuthService.register(req, res));
router.post("/login", (req, res) => AuthService.login(req, res));

module.exports = router;