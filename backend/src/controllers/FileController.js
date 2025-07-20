const FileService = require("../services/FileService");

class FileController {
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Arquivo não enviado." });
      }

      const originalName = req.body.name;
      const savedName = req.file.filename;
      const topicId = req.params.topicId;

      const savedFile = await FileService.uploadFile({
        originalname: originalName,
        filename: savedName,
        topicId
      });

      res.status(201).json(savedFile);
    } catch (err) {
      console.error("Erro uploadFile:", err);
      res.status(500).json({ error: "Erro ao fazer upload." });
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
