const express = require("express");
const auth = require("../middleware/authMiddleware");
const UserService = require("../services/UserService");

const router = express.Router();

router.get("/", auth(), (req, res) => UserService.findByEmail(req, res));

module.exports = router;
