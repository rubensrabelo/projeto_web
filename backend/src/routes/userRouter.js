const express = require("express");
const auth = require("../middleware/authMiddleware");
const UserController = require("../controllers/UserController");

const router = express.Router();

router.get("/me", auth(), (req, res) => UserController.getProfile(req, res));

module.exports = router;
