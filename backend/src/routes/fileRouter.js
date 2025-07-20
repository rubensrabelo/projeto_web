const express = require("express");
const FileController = require("../controllers/FileController");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/:topicId", auth("teacher"), upload.single("file"), FileController.uploadFile);
router.get("/:topicId", auth(), FileController.listByTopic);
router.put("/update/:fileId", auth("teacher"), FileController.update);
router.delete("/delete/:fileId", auth("teacher"), FileController.remove);

module.exports = router;
