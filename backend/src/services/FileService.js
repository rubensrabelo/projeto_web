const File = require("../models/File");

class FileService {
  async addFile({ name, url, topicId }) {
    return await File.create({ name, url, topic: topicId });
  }

  async getFilesByTopic(topicId) {
    return await File.find({ topic: topicId });
  }

  async updateFile(fileId, data) {
    const file = await File.findByIdAndUpdate(fileId, data, { new: true });
    return file;
  }

  async deleteFile(fileId) {
    await File.findByIdAndDelete(fileId);
  }
}

module.exports = new FileService();
