const User = require("../models/User");
const bcrypt = require("bcryptjs");

class UserService {
  async getUserById(id) {
    return await User.findById(id).select("-password");
  }

  async update(userId, updateData) {
    if (updateData.password) {
      const trimmed = updateData.password.trim();
      if (trimmed !== "") {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(trimmed, salt);
      } else {
        delete updateData.password;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    return updatedUser;
  }
}

module.exports = new UserService();
