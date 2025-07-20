const File = require("../models/File");

class FileService {
  async uploadFile({ originalname, filename, topicId}) {
    const fileData = {
      name: originalname,
      savedName: filename,
      url: `/uploads/${filename}`,
      topic: topicId
    };

    const newFile = new File(fileData);
    return await newFile.save();
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
