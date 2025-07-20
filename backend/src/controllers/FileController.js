const FileService = require("../services/FileService");

class FileController {
  async add(req, res) {
    const { topicId } = req.params;

    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const fileData = {
      name: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      topicId
    };

    try {
      const file = await FileService.addFile(fileData);
      res.status(201).json(file);
    } catch (err) {
      res.status(500).json({ error: "Failed to add file." });
    }
  }

  async listByTopic(req, res) {
    const { topicId } = req.params;
    try {
      const files = await FileService.getFilesByTopic(topicId);
      res.json(files);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch files." });
    }
  }

  async update(req, res) {
    const { fileId } = req.params;
    try {
      const updated = await FileService.updateFile(fileId, req.body);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to update file." });
    }
  }

  async remove(req, res) {
    const { fileId } = req.params;
    try {
      await FileService.deleteFile(fileId);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: "Failed to delete file." });
    }
  }
}

module.exports = new FileController();
