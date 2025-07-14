const express = require("express");
const auth = require("../middleware/authMiddleware");
const UserController = require("../controllers/UserController");

const router = express.Router();

router.get("/me", auth(), UserController.getProfile);

module.exports = router;
